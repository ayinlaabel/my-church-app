import { axiosFetch } from "@configs/axios";
import { submitCellReportRequest } from "@declared-types/index";

class ReportService {
  async submitCellReport(payload: submitCellReportRequest) {
    return axiosFetch
      .post("/church/cell-report/new", payload)
      .then((res) => res.data);
  }
  async getAllCellReport() {
    return axiosFetch.get("/church/cells/reports").then((res) => res.data);
  }
}
export default new ReportService();
