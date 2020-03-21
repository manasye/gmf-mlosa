import { isAdmin } from "./func";

export const perPageOptions = [
  {
    value: "10",
    text: "10"
  },
  {
    value: "20",
    text: "20"
  },
  {
    value: "50",
    text: "50"
  }
];

export const months = [
  {
    text: "January",
    value: "1"
  },
  {
    text: "February",
    value: "2"
  },
  {
    text: "March",
    value: "3"
  },
  {
    text: "April",
    value: "4"
  },
  {
    text: "May",
    value: "5"
  },
  {
    text: "June",
    value: "6"
  },
  {
    text: "July",
    value: "7"
  },
  {
    text: "August",
    value: "8"
  },
  {
    text: "September",
    value: "9"
  },
  {
    text: "October",
    value: "10"
  },
  {
    text: "November",
    value: "11"
  },
  {
    text: "December",
    value: "12"
  }
];

let status = [
  {
    value: "Open",
    text: "Open"
  },
  {
    value: "Overdue",
    text: "Overdue"
  },
  {
    value: "On Progress",
    text: "On Progress"
  },
  {
    value: "Closed",
    text: "Closed"
  },
  {
    value: "Verified",
    text: "Verified"
  }
];

if (!isAdmin()) {
  status.pop();
}

export const statusObservation = status;

export const statusReport = [
  {
    value: "Need Checking",
    text: "Need Checking"
  },
  {
    value: "Need Approval",
    text: "Need Approval"
  },
  {
    value: "Revised",
    text: "Revised"
  },
  {
    value: "Approved",
    text: "Approved"
  }
];

export const safetyRisk = [
  { value: null, text: "-" },
  { value: "S", text: "Safety" },
  { value: "AR", text: "At Risk" },
  { value: "DNO", text: "Didn't Observe" },
  { value: "N/A", text: "Not Applicable" }
];

export const hazardCode = [
  { value: null, text: "-" },
  { value: "A", text: "A. Information" },
  { value: "B", text: "B. Equipment / Tools / Safety Equipment" },
  { value: "C", text: "C. Aircraft Design / Configuration / Parts" },
  { value: "D", text: "D. Job / Task" },
  { value: "E", text: "E. Knowledge / Skills" },
  { value: "F", text: "F. Individual Factors" },
  { value: "G", text: "G. Environment / Facilities" },
  { value: "H", text: "H. Organization Factors" },
  { value: "I", text: "I. Leadership / Supervision" },
  { value: "J", text: "J. Communication" },
  { value: "K", text: "K. Inspection / Double Check" },
  { value: "L", text: "L. Other Contributing Factors" }
];

export const hazardEffManaged = [
  { value: null, text: "-" },
  { value: "N", text: "No" },
  { value: "Y", text: "Yes" }
];

export const errorOutcome = [
  { value: null, text: "-" },
  { value: "1", text: "Inconsequential" },
  { value: "2", text: "Undesired state" },
  { value: "3", text: "Additional error" }
];
