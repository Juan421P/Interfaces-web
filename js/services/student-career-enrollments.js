export const StudentCareerEnrollmentsService = {
    async list() {
        return [
            {
                studentCareerEnrollmentID: 101,
                careerID: 501,
                studentID: 201,
                socialServiceProjectID: 301,
                startDate: "2023-01-15",
                endDate: null,
                status: "active",
                statusDate: "2023-01-15",
                serviceStartDate: "2023-06-01",
                serviceEndDate: "2023-12-01",
                serviceStatus: "completed",
                serviceStatusDate: "2023-12-01"
            },
            {
                studentCareerEnrollmentID: 102,
                careerID: 502,
                studentID: 202,
                socialServiceProjectID: 302,
                startDate: "2022-09-01",
                endDate: "2023-08-30",
                status: "graduated",
                statusDate: "2023-08-30",
                serviceStartDate: "2023-01-10",
                serviceEndDate: "2023-07-10",
                serviceStatus: "completed",
                serviceStatusDate: "2023-07-10"
            },
            {
                studentCareerEnrollmentID: 103,
                careerID: 503,
                studentID: 203,
                socialServiceProjectID: 303,
                startDate: "2024-02-20",
                endDate: null,
                status: "active",
                statusDate: "2024-02-20",
                serviceStartDate: null,
                serviceEndDate: null,
                serviceStatus: "pending",
                serviceStatusDate: "2024-02-20"
            },
            {
                studentCareerEnrollmentID: 104,
                careerID: 504,
                studentID: 204,
                socialServiceProjectID: 304,
                startDate: "2021-08-10",
                endDate: "2024-01-15",
                status: "dropped",
                statusDate: "2024-01-15",
                serviceStartDate: null,
                serviceEndDate: null,
                serviceStatus: "not started",
                serviceStatusDate: "2024-01-15"
            },
            {
                studentCareerEnrollmentID: 105,
                careerID: 505,
                studentID: 205,
                socialServiceProjectID: 305,
                startDate: "2023-05-01",
                endDate: null,
                status: "active",
                statusDate: "2023-05-01",
                serviceStartDate: "2024-01-20",
                serviceEndDate: null,
                serviceStatus: "in progress",
                serviceStatusDate: "2024-01-20"
            }
        ];
    }
}