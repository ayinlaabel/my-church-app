#!/usr/bin/env bash
#
# scripts/get-pins.sh — fetch leaf-cert public key fingerprints for every
# host the mobile app talks to (HIGH-03 from the AppSec assessment).
#
# Output:
#   - SHA-256 of the certificate DER (whole-cert pin)
#   - SHA-256 of the SubjectPublicKeyInfo, base64 (RFC 7469 SPKI pin —
#     this is what react-native-ssl-pinning consumes)
#   - Cert subject + issuer + validity dates for sanity-checking
#
# Usage:
#   ./scripts/get-pins.sh
#   ./scripts/get-pins.sh apitest.custodianplc.com.ng    # single host
#
# Save the output to a dated file each time and diff against the last
# capture before rotating pins. If anything changes unexpectedly,
# investigate before publishing an OTA update.

set -euo pipefail

DEFAULT_HOSTS=(
  "apitest.custodianplc.com.ng:443"
  "claapitest.custodianplc.com.ng:443"
  "absapi.custodianplc.com.ng:443"
  "api.crusaderpensions.com:9913"
  "api.paystack.co:443"
  "standard.paystack.co:443"
)

# If args provided, use them. Otherwise scan the default set.
if [ "$#" -gt 0 ]; then
  HOSTS=("$@")
else
  HOSTS=("${DEFAULT_HOSTS[@]}")
fi

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: missing dependency '$1'" >&2
    exit 1
  }
}
need openssl
need awk

inspect_host() {
  local host_port="$1"
  local host port
  host="${host_port%:*}"
  port="${host_port##*:}"

  printf '\n=== %s:%s ===\n' "$host" "$port"

  local cert
  if ! cert=$(echo "" | openssl s_client \
                -connect "${host}:${port}" \
                -servername "$host" \
                -showcerts 2>/dev/null \
              | openssl x509 -outform PEM 2>/dev/null); then
    printf 'ERROR: could not retrieve cert for %s:%s\n' "$host" "$port" >&2
    return
  fi

  local subject issuer not_before not_after
  subject=$(printf '%s' "$cert" | openssl x509 -noout -subject 2>/dev/null | sed 's/^subject=//')
  issuer=$(printf '%s' "$cert" | openssl x509 -noout -issuer 2>/dev/null | sed 's/^issuer=//')
  not_before=$(printf '%s' "$cert" | openssl x509 -noout -startdate 2>/dev/null | sed 's/^notBefore=//')
  not_after=$(printf '%s' "$cert" | openssl x509 -noout -enddate 2>/dev/null | sed 's/^notAfter=//')

  printf 'Subject:    %s\n' "$subject"
  printf 'Issuer:     %s\n' "$issuer"
  printf 'Valid:      %s   →   %s\n' "$not_before" "$not_after"

  local sha256_der
  sha256_der=$(printf '%s' "$cert" | openssl x509 -outform DER 2>/dev/null \
                | openssl dgst -sha256 -hex | awk '{print $NF}')
  printf 'SHA-256 (DER, whole cert):\n  %s\n' "$sha256_der"

  local spki_b64
  spki_b64=$(printf '%s' "$cert" | openssl x509 -pubkey -noout 2>/dev/null \
              | openssl pkey -pubin -outform DER 2>/dev/null \
              | openssl dgst -sha256 -binary \
              | openssl base64)
  printf 'SHA-256 (SPKI, base64 — use this in PINS):\n  sha256/%s\n' "$spki_b64"
}

printf 'Cert fingerprint capture — %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '(Use the SPKI base64 form as the pin value.)\n'

for host_port in "${HOSTS[@]}"; do
  inspect_host "$host_port"
done

printf '\nDone. Save this output dated; diff against the last capture before rotating any pin.\n'
