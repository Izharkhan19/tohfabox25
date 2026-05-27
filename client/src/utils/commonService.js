// import CryptoJS from "crypto-js";
// // import { parsePhoneNumberFromString } from "libphonenumber-js";
// import moment from "moment-timezone";
// import { useSelector } from "react-redux";
// import Swal from "sweetalert2";
// // import authentication from "../assets/images/Authentication.svg";
// // import MastercardImg from "../assets/images/master-card.png";
// // import RupayIcon from "../assets/images/rupay-logo.png";
// // import VisaIcon from "../assets/images/visa_icon.png";
// // import AmaxIcon from "../assets/images/amex.png";
// // import EmailIcon from "../assets/images/email-icon.svg";
// // import FacebookIcon from "../assets/images/facebook-icon.svg";
// // import InstagramIcon from "../assets/images/instagram-icon.svg";
// // import LinkedInIcon from "../assets/images/linkedIn-icon.svg";
// // import RcsIcon from "../assets/images/rcs-icon.svg";
// // import SmsIcon from "../assets/images/sms-icon.svg";
// // import VoiceIcon from "../assets/images/voice-icon.svg";
// // import WhatsappIcon from "../assets/images/whatsapp-icon.svg";
// // import Xicon from "../assets/images/x-icon.svg";
// // import DiscoverIcon from "../assets/images/discoverIcon.jpg";

import moment from "moment";

// // import billingsandplans from "../assets/images/billingsandplans.svg";
// // import Clienticon from "../assets/images/clientsicon.svg";
// // import homeicon from "../assets/images/homeicon.svg";
// // import Project from "../assets/images/Project.svg";
// // import CreditcoinIcon from "../assets/images/credit-coin-Icon.svg";
// // import session from "../assets/images/session.svg";
// // import Teamicon from "../assets/images/Team.svg";
// // import usericon from "../assets/images/user.svg";
// // import workspaceone from "../assets/images/workspaceone.svg";
// import { API_URL } from "../services/Apiroute";
// import { apiCall } from "../services/Axiosservice";
// // import verypositive from "../assets/images/verypositive-icon.svg";
// // import positive from "../assets/images/positive-icon.svg";
// // import neutral from "../assets/images/neutral-icon.svg";
// // import negative from "../assets/images/negative-icon.svg";
// // import verynegative from "../assets/images/verynegative-icon.svg";

// const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const IP_INFO_KEY = import.meta.env.VITE_IP_INFO_API_KEY;
// const IP_INFO_KEY1 = import.meta.env;
// export const commonService = {
//   setItem,
//   getItem,
//   getHeaders,
//   getHeadersFromData,
//   showAlert,
//   cropImage,
//   removeItem,
//   fnCheckValidationOfObject,
//   setEncryptData,
//   getDecryptData,
//   clearLocalStorage,
//   getDateInFormat,
//   getDateInHHMMSSFormat,
//   getTimeInFormat,
//   DurationfromSeconds,
//   getSentimentIcon,
//   DashboardCardIcon,
//   stripHTML,
//   truncateText,
//   getLocalTime,
//   getVectorStore,
//   getLoginRoleData,
//   getEncodedValue,
//   // getProjectRoleData,
//   getFilterInputByRegex,
//   getNumberValue,
//   formatNumberWithCommas,
//   getCountryCodeByIP,
//   getTimeInFormatForTwillio,
//   getFullDateTimeInFormat,
//   maskEmail,
//   validateURL,
//   getPassUTCDateTime,
//   getDateInGivenFormat,
//   fnEncryptValue,
//   fnDecryptValue,
//   fnorderonName,
//   getDaysLeft,
//   fnCreditCardImg,
//   getProgressBarColor,
//   getTextColor,
//   getStatusBadgeClass,
//   getCampaignIcon,
//   getTextStatusColor,
//   getLocalTimeAMPM,
// };

// const cryptoKey = "mR_PrAk@sh_007";
// export const DefaultPerPageLength = 15;
// export const DefaultCurrentFullDate = new Date();
// export const DefaultRowsPerPageOptions = [15, 30, 45, 60];
// export const DefaultSessionOptions = [10, 20];
// export const DefaultWMYOptions = ["Week", "Month", "Year"];
// export const DefaultCandidateStatus = [
//   "In Progress",
//   "Interview Scheduled",
//   "Under Review",
//   "Rejected",
//   "Hired",
// ];
// export const DefaultJobStatus = ["Active", "Draft", "Closed", "Paused"];
// export const DefaultProjectTypeOptions = ["All", "Chat", "Voice"];
// export const DefaultHeaderTypeOptions = ["Auth", "Value"];
// export const DefaultUnitsOptions = [
//   { label: "Kms", value: "kms" },
//   { label: "Miles", value: "miles" },
// ];
// export const DefaultHeaderAuthTypeOptions = ["Basic Auth", "Bearer Token"];
// export const DefaultSecretTypeOptions = [
//   "Constant Varibles",
//   "System Variables",
// ];
// export const DefaultcountryMap = {
//   AW: "Aruba",
//   AF: "Afghanistan",
//   AO: "Angola",
//   AI: "Anguilla",
//   AX: "Åland Islands",
//   AL: "Albania",
//   AD: "Andorra",
//   AE: "United Arab Emirates",
//   AR: "Argentina",
//   AM: "Armenia",
//   AS: "American Samoa",
//   AQ: "Antarctica",
//   TF: "French Southern Territories",
//   AG: "Antigua and Barbuda",
//   AU: "Australia",
//   AT: "Austria",
//   AZ: "Azerbaijan",
//   BI: "Burundi",
//   BE: "Belgium",
//   BJ: "Benin",
//   BQ: "Bonaire, Sint Eustatius and Saba",
//   BF: "Burkina Faso",
//   BD: "Bangladesh",
//   BG: "Bulgaria",
//   BH: "Bahrain",
//   BS: "Bahamas",
//   BA: "Bosnia and Herzegovina",
//   BL: "Saint Barthélemy",
//   BY: "Belarus",
//   BZ: "Belize",
//   BM: "Bermuda",
//   BO: "Bolivia, Plurinational State of",
//   BR: "Brazil",
//   BB: "Barbados",
//   BN: "Brunei Darussalam",
//   BT: "Bhutan",
//   BV: "Bouvet Island",
//   BW: "Botswana",
//   CF: "Central African Republic",
//   CA: "Canada",
//   CC: "Cocos (Keeling) Islands",
//   CH: "Switzerland",
//   CL: "Chile",
//   CN: "China",
//   CI: "Côte d'Ivoire",
//   CM: "Cameroon",
//   CD: "Congo, The Democratic Republic of the",
//   CG: "Congo",
//   CK: "Cook Islands",
//   CO: "Colombia",
//   KM: "Comoros",
//   CV: "Cabo Verde",
//   CR: "Costa Rica",
//   CU: "Cuba",
//   CW: "Curaçao",
//   CX: "Christmas Island",
//   KY: "Cayman Islands",
//   CY: "Cyprus",
//   CZ: "Czechia",
//   DE: "Germany",
//   DJ: "Djibouti",
//   DM: "Dominica",
//   DK: "Denmark",
//   DO: "Dominican Republic",
//   DZ: "Algeria",
//   EC: "Ecuador",
//   EG: "Egypt",
//   ER: "Eritrea",
//   EH: "Western Sahara",
//   ES: "Spain",
//   EE: "Estonia",
//   ET: "Ethiopia",
//   FI: "Finland",
//   FJ: "Fiji",
//   FK: "Falkland Islands (Malvinas)",
//   FR: "France",
//   FO: "Faroe Islands",
//   FM: "Micronesia, Federated States of",
//   GA: "Gabon",
//   GB: "United Kingdom",
//   GE: "Georgia",
//   GG: "Guernsey",
//   GH: "Ghana",
//   GI: "Gibraltar",
//   GN: "Guinea",
//   GP: "Guadeloupe",
//   GM: "Gambia",
//   GW: "Guinea-Bissau",
//   GQ: "Equatorial Guinea",
//   GR: "Greece",
//   GD: "Grenada",
//   GL: "Greenland",
//   GT: "Guatemala",
//   GF: "French Guiana",
//   GU: "Guam",
//   GY: "Guyana",
//   HK: "Hong Kong",
//   HM: "Heard Island and McDonald Islands",
//   HN: "Honduras",
//   HR: "Croatia",
//   HT: "Haiti",
//   HU: "Hungary",
//   ID: "Indonesia",
//   IM: "Isle of Man",
//   IN: "India",
//   IO: "British Indian Ocean Territory",
//   IE: "Ireland",
//   IR: "Iran, Islamic Republic of",
//   IQ: "Iraq",
//   IS: "Iceland",
//   IL: "Israel",
//   IT: "Italy",
//   JM: "Jamaica",
//   JE: "Jersey",
//   JO: "Jordan",
//   JP: "Japan",
//   KZ: "Kazakhstan",
//   KE: "Kenya",
//   KG: "Kyrgyzstan",
//   KH: "Cambodia",
//   KI: "Kiribati",
//   KN: "Saint Kitts and Nevis",
//   KR: "Korea, Republic of",
//   KW: "Kuwait",
//   LA: "Lao People's Democratic Republic",
//   LB: "Lebanon",
//   LR: "Liberia",
//   LY: "Libya",
//   LC: "Saint Lucia",
//   LI: "Liechtenstein",
//   LK: "Sri Lanka",
//   LS: "Lesotho",
//   LT: "Lithuania",
//   LU: "Luxembourg",
//   LV: "Latvia",
//   MO: "Macao",
//   MF: "Saint Martin (French part)",
//   MA: "Morocco",
//   MC: "Monaco",
//   MD: "Moldova, Republic of",
//   MG: "Madagascar",
//   MV: "Maldives",
//   MX: "Mexico",
//   MH: "Marshall Islands",
//   MK: "North Macedonia",
//   ML: "Mali",
//   MT: "Malta",
//   MM: "Myanmar",
//   ME: "Montenegro",
//   MN: "Mongolia",
//   MP: "Northern Mariana Islands",
//   MZ: "Mozambique",
//   MR: "Mauritania",
//   MS: "Montserrat",
//   MQ: "Martinique",
//   MU: "Mauritius",
//   MW: "Malawi",
//   MY: "Malaysia",
//   YT: "Mayotte",
//   NA: "Namibia",
//   NC: "New Caledonia",
//   NE: "Niger",
//   NF: "Norfolk Island",
//   NG: "Nigeria",
//   NI: "Nicaragua",
//   NU: "Niue",
//   NL: "Netherlands",
//   NO: "Norway",
//   NP: "Nepal",
//   NR: "Nauru",
//   NZ: "New Zealand",
//   OM: "Oman",
//   PK: "Pakistan",
//   PA: "Panama",
//   PN: "Pitcairn",
//   PE: "Peru",
//   PH: "Philippines",
//   PW: "Palau",
//   PG: "Papua New Guinea",
//   PL: "Poland",
//   PR: "Puerto Rico",
//   KP: "Korea, Democratic People's Republic of",
//   PT: "Portugal",
//   PY: "Paraguay",
//   PS: "Palestine, State of",
//   PF: "French Polynesia",
//   QA: "Qatar",
//   RE: "Réunion",
//   RO: "Romania",
//   RU: "Russian Federation",
//   RW: "Rwanda",
//   SA: "Saudi Arabia",
//   SD: "Sudan",
//   SN: "Senegal",
//   SG: "Singapore",
//   GS: "South Georgia and the South Sandwich Islands",
//   SH: "Saint Helena, Ascension and Tristan da Cunha",
//   SJ: "Svalbard and Jan Mayen",
//   SB: "Solomon Islands",
//   SL: "Sierra Leone",
//   SV: "El Salvador",
//   SM: "San Marino",
//   SO: "Somalia",
//   PM: "Saint Pierre and Miquelon",
//   RS: "Serbia",
//   SS: "South Sudan",
//   ST: "Sao Tome and Principe",
//   SR: "Suriname",
//   SK: "Slovakia",
//   SI: "Slovenia",
//   SE: "Sweden",
//   SZ: "Eswatini",
//   SX: "Sint Maarten (Dutch part)",
//   SC: "Seychelles",
//   SY: "Syrian Arab Republic",
//   TC: "Turks and Caicos Islands",
//   TD: "Chad",
//   TG: "Togo",
//   TH: "Thailand",
//   TJ: "Tajikistan",
//   TK: "Tokelau",
//   TM: "Turkmenistan",
//   TL: "Timor-Leste",
//   TO: "Tonga",
//   TT: "Trinidad and Tobago",
//   TN: "Tunisia",
//   TR: "Turkey",
//   TV: "Tuvalu",
//   TW: "Taiwan, Province of China",
//   TZ: "Tanzania, United Republic of",
//   UG: "Uganda",
//   UA: "Ukraine",
//   UM: "United States Minor Outlying Islands",
//   UY: "Uruguay",
//   US: "United States",
//   UZ: "Uzbekistan",
//   VA: "Holy See (Vatican City State)",
//   VC: "Saint Vincent and the Grenadines",
//   VE: "Venezuela, Bolivarian Republic of",
//   VG: "Virgin Islands, British",
//   VI: "Virgin Islands, U.S.",
//   VN: "Viet Nam",
//   VU: "Vanuatu",
//   WF: "Wallis and Futuna",
//   WS: "Samoa",
//   YE: "Yemen",
//   ZA: "South Africa",
//   ZM: "Zambia",
//   ZW: "Zimbabwe",
// };
// export const DefaultCallTypes = [
//   { value: "inbound", label: "Inbound" },
//   { value: "outbound", label: "Outbound" },
// ];
// export const DefaultMonthOptions = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// // export const ProjectDetailmenuItem = [
// //   {
// //     name: "AI chat",
// //     icon: homeicon,
// //     link: "",
// //     child: [
// //       {
// //         name: "dashboard",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "design",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "assistant configure",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "agent configure",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "knowledge base",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "functions",
// //         icon: homeicon,
// //         link: "",
// //       },

// //       {
// //         name: "evaluate",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "publish",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       // {
// //       //   name: "team",
// //       //   icon: homeicon,
// //       //   link: "",
// //       // },
// //       {
// //         name: "sessions",
// //         icon: homeicon,
// //         link: "",
// //       },
// //     ],
// //   },
// //   {
// //     name: "AI voice assistant",
// //     icon: Teamicon,
// //     link: "",
// //     child: [
// //       {
// //         name: "dashboard",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "design",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "assistant configure",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "agent configure",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "knowledge base",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "functions",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "evaluate",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "telephony",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "publish",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       // {
// //       //   name: "team",
// //       //   icon: homeicon,
// //       //   link: "",
// //       // },

// //       {
// //         name: "sessions",
// //         icon: homeicon,
// //         link: "",
// //       },
// //     ],
// //   },
// //   // {
// //   //   name: "Personalized",
// //   //   icon: setupicon,
// //   //   link: "",
// //   //   child: [
// //   //     {
// //   //       name: "Configure",
// //   //       icon: homeicon,
// //   //       link: "",
// //   //     },
// //   //   ],
// //   // },
// // ];
// // export const SettingmenuItem = [
// //   // {
// //   //   name: "profile",
// //   //   icon: usericon,
// //   //   link: "",
// //   // },
// //   // {
// //   //   name: "Account Setting",
// //   //   icon: usericon,
// //   //   link: "",
// //   // },
// //   {
// //     name: "password & authentication",
// //     icon: authentication,
// //     link: "",
// //   },
// //   {
// //     name: "contacts",
// //     icon: usericon,
// //     link: "",
// //   },
// //   {
// //     name: "billings & plans",
// //     icon: billingsandplans,
// //     link: "",
// //     child: [
// //       {
// //         name: "billings & Cost Management",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "payment method",
// //         icon: homeicon,
// //         link: "",
// //       },
// //       {
// //         name: "subscriptions",
// //         icon: homeicon,
// //         link: "",
// //       },
// //     ],
// //   },
// //   // {
// //   //   name: "Recursive function",
// //   //   icon: usericon,
// //   //   link: "",
// //   // },
// //   // {
// //   //   name: "AI chat",
// //   //   icon: homeicon,
// //   //   link: "",
// //   //   child: [
// //   //     {
// //   //       name: "Ai Configuration",
// //   //       icon: homeicon,
// //   //       link: "",
// //   //     },
// //   //   ],
// //   // },
// // ];
// export const TIMEZONE_LIST = [
//   {
//     displayName: "(GMT +00:00) Africa/Abidjan",
//     value: "Africa/Abidjan",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Accra",
//     value: "Africa/Accra",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Addis_Ababa",
//     value: "Africa/Addis_Ababa",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(CET +01:00) Africa/Algiers",
//     value: "Africa/Algiers",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Asmara",
//     value: "Africa/Asmara",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Asmera",
//     value: "Africa/Asmera",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Bamako",
//     value: "Africa/Bamako",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Bangui",
//     value: "Africa/Bangui",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Banjul",
//     value: "Africa/Banjul",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Bissau",
//     value: "Africa/Bissau",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Blantyre",
//     value: "Africa/Blantyre",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Brazzaville",
//     value: "Africa/Brazzaville",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Bujumbura",
//     value: "Africa/Bujumbura",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(EET +02:00) Africa/Cairo",
//     value: "Africa/Cairo",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Africa/Ceuta",
//     value: "Africa/Ceuta",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Conakry",
//     value: "Africa/Conakry",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Dakar",
//     value: "Africa/Dakar",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Dar_es_Salaam",
//     value: "Africa/Dar_es_Salaam",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Djibouti",
//     value: "Africa/Djibouti",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Douala",
//     value: "Africa/Douala",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Freetown",
//     value: "Africa/Freetown",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Gaborone",
//     value: "Africa/Gaborone",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Harare",
//     value: "Africa/Harare",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(SAST +02:00) Africa/Johannesburg",
//     value: "Africa/Johannesburg",
//     shortValue: "SAST",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Juba",
//     value: "Africa/Juba",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Kampala",
//     value: "Africa/Kampala",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Khartoum",
//     value: "Africa/Khartoum",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Kigali",
//     value: "Africa/Kigali",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Kinshasa",
//     value: "Africa/Kinshasa",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Lagos",
//     value: "Africa/Lagos",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Libreville",
//     value: "Africa/Libreville",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Lome",
//     value: "Africa/Lome",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Luanda",
//     value: "Africa/Luanda",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Lubumbashi",
//     value: "Africa/Lubumbashi",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Lusaka",
//     value: "Africa/Lusaka",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Malabo",
//     value: "Africa/Malabo",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Maputo",
//     value: "Africa/Maputo",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(SAST +02:00) Africa/Maseru",
//     value: "Africa/Maseru",
//     shortValue: "SAST",
//   },
//   {
//     displayName: "(SAST +02:00) Africa/Mbabane",
//     value: "Africa/Mbabane",
//     shortValue: "SAST",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Mogadishu",
//     value: "Africa/Mogadishu",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Monrovia",
//     value: "Africa/Monrovia",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EAT +03:00) Africa/Nairobi",
//     value: "Africa/Nairobi",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Ndjamena",
//     value: "Africa/Ndjamena",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Niamey",
//     value: "Africa/Niamey",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Nouakchott",
//     value: "Africa/Nouakchott",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Ouagadougou",
//     value: "Africa/Ouagadougou",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(WAT +01:00) Africa/Porto-Novo",
//     value: "Africa/Porto-Novo",
//     shortValue: "WAT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Sao_Tome",
//     value: "Africa/Sao_Tome",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Africa/Timbuktu",
//     value: "Africa/Timbuktu",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EET +02:00) Africa/Tripoli",
//     value: "Africa/Tripoli",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Africa/Tunis",
//     value: "Africa/Tunis",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CAT +02:00) Africa/Windhoek",
//     value: "Africa/Windhoek",
//     shortValue: "CAT",
//   },
//   {
//     displayName: "(HST −10:00) America/Adak",
//     value: "America/Adak",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Anchorage",
//     value: "America/Anchorage",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(AST −04:00) America/Anguilla",
//     value: "America/Anguilla",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Antigua",
//     value: "America/Antigua",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Aruba",
//     value: "America/Aruba",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(EST −05:00) America/Atikokan",
//     value: "America/Atikokan",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(HST −10:00) America/Atka",
//     value: "America/Atka",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(CST −06:00) America/Bahia_Banderas",
//     value: "America/Bahia_Banderas",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Barbados",
//     value: "America/Barbados",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Belize",
//     value: "America/Belize",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Blanc-Sablon",
//     value: "America/Blanc-Sablon",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(MST −07:00) America/Boise",
//     value: "America/Boise",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(MST −07:00) America/Cambridge_Bay",
//     value: "America/Cambridge_Bay",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Cancun",
//     value: "America/Cancun",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Cayman",
//     value: "America/Cayman",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(CST −06:00) America/Chicago",
//     value: "America/Chicago",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Chihuahua",
//     value: "America/Chihuahua",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) America/Ciudad_Juarez",
//     value: "America/Ciudad_Juarez",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Coral_Harbour",
//     value: "America/Coral_Harbour",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(CST −06:00) America/Costa_Rica",
//     value: "America/Costa_Rica",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) America/Creston",
//     value: "America/Creston",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(AST −04:00) America/Curacao",
//     value: "America/Curacao",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(GMT +00:00) America/Danmarkshavn",
//     value: "America/Danmarkshavn",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(MST −07:00) America/Dawson",
//     value: "America/Dawson",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(MST −07:00) America/Dawson_Creek",
//     value: "America/Dawson_Creek",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(MST −07:00) America/Denver",
//     value: "America/Denver",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Detroit",
//     value: "America/Detroit",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Dominica",
//     value: "America/Dominica",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(MST −07:00) America/Edmonton",
//     value: "America/Edmonton",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CST −06:00) America/El_Salvador",
//     value: "America/El_Salvador",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(PST −08:00) America/Ensenada",
//     value: "America/Ensenada",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(MST −07:00) America/Fort_Nelson",
//     value: "America/Fort_Nelson",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Fort_Wayne",
//     value: "America/Fort_Wayne",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Glace_Bay",
//     value: "America/Glace_Bay",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Goose_Bay",
//     value: "America/Goose_Bay",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(EST −05:00) America/Grand_Turk",
//     value: "America/Grand_Turk",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Grenada",
//     value: "America/Grenada",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Guadeloupe",
//     value: "America/Guadeloupe",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Guatemala",
//     value: "America/Guatemala",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Halifax",
//     value: "America/Halifax",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −05:00) America/Havana",
//     value: "America/Havana",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) America/Hermosillo",
//     value: "America/Hermosillo",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Indianapolis",
//     value: "America/Indiana/Indianapolis",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(CST −06:00) America/Indiana/Knox",
//     value: "America/Indiana/Knox",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Marengo",
//     value: "America/Indiana/Marengo",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Petersburg",
//     value: "America/Indiana/Petersburg",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(CST −06:00) America/Indiana/Tell_City",
//     value: "America/Indiana/Tell_City",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Vevay",
//     value: "America/Indiana/Vevay",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Vincennes",
//     value: "America/Indiana/Vincennes",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indiana/Winamac",
//     value: "America/Indiana/Winamac",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Indianapolis",
//     value: "America/Indianapolis",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(MST −07:00) America/Inuvik",
//     value: "America/Inuvik",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Iqaluit",
//     value: "America/Iqaluit",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Jamaica",
//     value: "America/Jamaica",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Juneau",
//     value: "America/Juneau",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(EST −05:00) America/Kentucky/Louisville",
//     value: "America/Kentucky/Louisville",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Kentucky/Monticello",
//     value: "America/Kentucky/Monticello",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(CST −06:00) America/Knox_IN",
//     value: "America/Knox_IN",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Kralendijk",
//     value: "America/Kralendijk",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(PST −08:00) America/Los_Angeles",
//     value: "America/Los_Angeles",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(EST −05:00) America/Louisville",
//     value: "America/Louisville",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Lower_Princes",
//     value: "America/Lower_Princes",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Managua",
//     value: "America/Managua",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Marigot",
//     value: "America/Marigot",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Martinique",
//     value: "America/Martinique",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Matamoros",
//     value: "America/Matamoros",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) America/Mazatlan",
//     value: "America/Mazatlan",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CST −06:00) America/Menominee",
//     value: "America/Menominee",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Merida",
//     value: "America/Merida",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Metlakatla",
//     value: "America/Metlakatla",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(CST −06:00) America/Mexico_City",
//     value: "America/Mexico_City",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Moncton",
//     value: "America/Moncton",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Monterrey",
//     value: "America/Monterrey",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) America/Montreal",
//     value: "America/Montreal",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Montserrat",
//     value: "America/Montserrat",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(EST −05:00) America/Nassau",
//     value: "America/Nassau",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/New_York",
//     value: "America/New_York",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Nipigon",
//     value: "America/Nipigon",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Nome",
//     value: "America/Nome",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(CST −06:00) America/North_Dakota/Beulah",
//     value: "America/North_Dakota/Beulah",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/North_Dakota/Center",
//     value: "America/North_Dakota/Center",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/North_Dakota/New_Salem",
//     value: "America/North_Dakota/New_Salem",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Ojinaga",
//     value: "America/Ojinaga",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) America/Panama",
//     value: "America/Panama",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) America/Pangnirtung",
//     value: "America/Pangnirtung",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(MST −07:00) America/Phoenix",
//     value: "America/Phoenix",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(EST −05:00) America/Port-au-Prince",
//     value: "America/Port-au-Prince",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Port_of_Spain",
//     value: "America/Port_of_Spain",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/Puerto_Rico",
//     value: "America/Puerto_Rico",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Rainy_River",
//     value: "America/Rainy_River",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Rankin_Inlet",
//     value: "America/Rankin_Inlet",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Regina",
//     value: "America/Regina",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Resolute",
//     value: "America/Resolute",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(PST −08:00) America/Santa_Isabel",
//     value: "America/Santa_Isabel",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(AST −04:00) America/Santo_Domingo",
//     value: "America/Santo_Domingo",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(MST −07:00) America/Shiprock",
//     value: "America/Shiprock",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Sitka",
//     value: "America/Sitka",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(AST −04:00) America/St_Barthelemy",
//     value: "America/St_Barthelemy",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(NST −03:30) America/St_Johns",
//     value: "America/St_Johns",
//     shortValue: "NST",
//   },
//   {
//     displayName: "(AST −04:00) America/St_Kitts",
//     value: "America/St_Kitts",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/St_Lucia",
//     value: "America/St_Lucia",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/St_Thomas",
//     value: "America/St_Thomas",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(AST −04:00) America/St_Vincent",
//     value: "America/St_Vincent",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) America/Swift_Current",
//     value: "America/Swift_Current",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −06:00) America/Tegucigalpa",
//     value: "America/Tegucigalpa",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AST −04:00) America/Thule",
//     value: "America/Thule",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(EST −05:00) America/Thunder_Bay",
//     value: "America/Thunder_Bay",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(PST −08:00) America/Tijuana",
//     value: "America/Tijuana",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(EST −05:00) America/Toronto",
//     value: "America/Toronto",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(AST −04:00) America/Tortola",
//     value: "America/Tortola",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(PST −08:00) America/Vancouver",
//     value: "America/Vancouver",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(AST −04:00) America/Virgin",
//     value: "America/Virgin",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(MST −07:00) America/Whitehorse",
//     value: "America/Whitehorse",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CST −06:00) America/Winnipeg",
//     value: "America/Winnipeg",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(AKST −09:00) America/Yakutat",
//     value: "America/Yakutat",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(MST −07:00) America/Yellowknife",
//     value: "America/Yellowknife",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(AEST +10:00) Antarctica/Macquarie",
//     value: "Antarctica/Macquarie",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(NZST +12:00) Antarctica/McMurdo",
//     value: "Antarctica/McMurdo",
//     shortValue: "NZST",
//   },
//   {
//     displayName: "(NZST +12:00) Antarctica/South_Pole",
//     value: "Antarctica/South_Pole",
//     shortValue: "NZST",
//   },
//   {
//     displayName: "(CET +01:00) Arctic/Longyearbyen",
//     value: "Arctic/Longyearbyen",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Asia/Beirut",
//     value: "Asia/Beirut",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(IST +05:30) Asia/Calcutta",
//     value: "Asia/Calcutta",
//     shortValue: "IST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Chongqing",
//     value: "Asia/Chongqing",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Chungking",
//     value: "Asia/Chungking",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EET +02:00) Asia/Famagusta",
//     value: "Asia/Famagusta",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(EET +02:00) Asia/Gaza",
//     value: "Asia/Gaza",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Harbin",
//     value: "Asia/Harbin",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EET +02:00) Asia/Hebron",
//     value: "Asia/Hebron",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(HKT +08:00) Asia/Hong_Kong",
//     value: "Asia/Hong_Kong",
//     shortValue: "HKT",
//   },
//   {
//     displayName: "(WIB +07:00) Asia/Jakarta",
//     value: "Asia/Jakarta",
//     shortValue: "WIB",
//   },
//   {
//     displayName: "(WIT +09:00) Asia/Jayapura",
//     value: "Asia/Jayapura",
//     shortValue: "WIT",
//   },
//   {
//     displayName: "(IST +02:00) Asia/Jerusalem",
//     value: "Asia/Jerusalem",
//     shortValue: "IST",
//   },
//   {
//     displayName: "(PKT +05:00) Asia/Karachi",
//     value: "Asia/Karachi",
//     shortValue: "PKT",
//   },
//   {
//     displayName: "(IST +05:30) Asia/Kolkata",
//     value: "Asia/Kolkata",
//     shortValue: "IST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Macao",
//     value: "Asia/Macao",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Macau",
//     value: "Asia/Macau",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(WITA +08:00) Asia/Makassar",
//     value: "Asia/Makassar",
//     shortValue: "WITA",
//   },
//   {
//     displayName: "(PST +08:00) Asia/Manila",
//     value: "Asia/Manila",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(EET +02:00) Asia/Nicosia",
//     value: "Asia/Nicosia",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(WIB +07:00) Asia/Pontianak",
//     value: "Asia/Pontianak",
//     shortValue: "WIB",
//   },
//   {
//     displayName: "(KST +09:00) Asia/Pyongyang",
//     value: "Asia/Pyongyang",
//     shortValue: "KST",
//   },
//   {
//     displayName: "(KST +09:00) Asia/Seoul",
//     value: "Asia/Seoul",
//     shortValue: "KST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Shanghai",
//     value: "Asia/Shanghai",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST +08:00) Asia/Taipei",
//     value: "Asia/Taipei",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(IST +02:00) Asia/Tel_Aviv",
//     value: "Asia/Tel_Aviv",
//     shortValue: "IST",
//   },
//   {
//     displayName: "(JST +09:00) Asia/Tokyo",
//     value: "Asia/Tokyo",
//     shortValue: "JST",
//   },
//   {
//     displayName: "(WITA +08:00) Asia/Ujung_Pandang",
//     value: "Asia/Ujung_Pandang",
//     shortValue: "WITA",
//   },
//   {
//     displayName: "(AST −04:00) Atlantic/Bermuda",
//     value: "Atlantic/Bermuda",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(WET +00:00) Atlantic/Canary",
//     value: "Atlantic/Canary",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(WET +00:00) Atlantic/Faeroe",
//     value: "Atlantic/Faeroe",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(WET +00:00) Atlantic/Faroe",
//     value: "Atlantic/Faroe",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(CET +01:00) Atlantic/Jan_Mayen",
//     value: "Atlantic/Jan_Mayen",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(WET +00:00) Atlantic/Madeira",
//     value: "Atlantic/Madeira",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(GMT +00:00) Atlantic/Reykjavik",
//     value: "Atlantic/Reykjavik",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Atlantic/St_Helena",
//     value: "Atlantic/St_Helena",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/ACT",
//     value: "Australia/ACT",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/Adelaide",
//     value: "Australia/Adelaide",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Brisbane",
//     value: "Australia/Brisbane",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/Broken_Hill",
//     value: "Australia/Broken_Hill",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Canberra",
//     value: "Australia/Canberra",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Currie",
//     value: "Australia/Currie",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/Darwin",
//     value: "Australia/Darwin",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Hobart",
//     value: "Australia/Hobart",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Lindeman",
//     value: "Australia/Lindeman",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Melbourne",
//     value: "Australia/Melbourne",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/North",
//     value: "Australia/North",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/NSW",
//     value: "Australia/NSW",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AWST +08:00) Australia/Perth",
//     value: "Australia/Perth",
//     shortValue: "AWST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Queensland",
//     value: "Australia/Queensland",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/South",
//     value: "Australia/South",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Sydney",
//     value: "Australia/Sydney",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Tasmania",
//     value: "Australia/Tasmania",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AEST +10:00) Australia/Victoria",
//     value: "Australia/Victoria",
//     shortValue: "AEST",
//   },
//   {
//     displayName: "(AWST +08:00) Australia/West",
//     value: "Australia/West",
//     shortValue: "AWST",
//   },
//   {
//     displayName: "(ACST +09:30) Australia/Yancowinna",
//     value: "Australia/Yancowinna",
//     shortValue: "ACST",
//   },
//   {
//     displayName: "(AST −04:00) Canada/Atlantic",
//     value: "Canada/Atlantic",
//     shortValue: "AST",
//   },
//   {
//     displayName: "(CST −06:00) Canada/Central",
//     value: "Canada/Central",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) Canada/Eastern",
//     value: "Canada/Eastern",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(MST −07:00) Canada/Mountain",
//     value: "Canada/Mountain",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(NST −03:30) Canada/Newfoundland",
//     value: "Canada/Newfoundland",
//     shortValue: "NST",
//   },
//   {
//     displayName: "(PST −08:00) Canada/Pacific",
//     value: "Canada/Pacific",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(CST −06:00) Canada/Saskatchewan",
//     value: "Canada/Saskatchewan",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) Canada/Yukon",
//     value: "Canada/Yukon",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CET +01:00) CET",
//     value: "CET",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CST −06:00) CST6CDT",
//     value: "CST6CDT",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(CST −05:00) Cuba",
//     value: "Cuba",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EET +02:00) EET",
//     value: "EET",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(EET +02:00) Egypt",
//     value: "Egypt",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(GMT +00:00) Eire",
//     value: "Eire",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EST −05:00) EST",
//     value: "EST",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) EST5EDT",
//     value: "EST5EDT",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(GMT +00:00) Etc/GMT",
//     value: "Etc/GMT",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Etc/GMT+0",
//     value: "Etc/GMT+0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Etc/GMT-0",
//     value: "Etc/GMT-0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Etc/GMT0",
//     value: "Etc/GMT0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Etc/Greenwich",
//     value: "Etc/Greenwich",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(UTC +00:00) Etc/UCT",
//     value: "Etc/UCT",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(UTC +00:00) Etc/Universal",
//     value: "Etc/Universal",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(UTC +00:00) Etc/UTC",
//     value: "Etc/UTC",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(UTC +00:00) Etc/Zulu",
//     value: "Etc/Zulu",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Amsterdam",
//     value: "Europe/Amsterdam",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Andorra",
//     value: "Europe/Andorra",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Athens",
//     value: "Europe/Athens",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/Belfast",
//     value: "Europe/Belfast",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Belgrade",
//     value: "Europe/Belgrade",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Berlin",
//     value: "Europe/Berlin",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Bratislava",
//     value: "Europe/Bratislava",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Brussels",
//     value: "Europe/Brussels",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Bucharest",
//     value: "Europe/Bucharest",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Budapest",
//     value: "Europe/Budapest",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Busingen",
//     value: "Europe/Busingen",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Chisinau",
//     value: "Europe/Chisinau",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Copenhagen",
//     value: "Europe/Copenhagen",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/Dublin",
//     value: "Europe/Dublin",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Gibraltar",
//     value: "Europe/Gibraltar",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/Guernsey",
//     value: "Europe/Guernsey",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Helsinki",
//     value: "Europe/Helsinki",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/Isle_of_Man",
//     value: "Europe/Isle_of_Man",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/Jersey",
//     value: "Europe/Jersey",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Kaliningrad",
//     value: "Europe/Kaliningrad",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Kiev",
//     value: "Europe/Kiev",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(MSK +03:00) Europe/Kirov",
//     value: "Europe/Kirov",
//     shortValue: "MSK",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Kyiv",
//     value: "Europe/Kyiv",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(WET +00:00) Europe/Lisbon",
//     value: "Europe/Lisbon",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Ljubljana",
//     value: "Europe/Ljubljana",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(GMT +00:00) Europe/London",
//     value: "Europe/London",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Luxembourg",
//     value: "Europe/Luxembourg",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Madrid",
//     value: "Europe/Madrid",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Malta",
//     value: "Europe/Malta",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Mariehamn",
//     value: "Europe/Mariehamn",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Monaco",
//     value: "Europe/Monaco",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(MSK +03:00) Europe/Moscow",
//     value: "Europe/Moscow",
//     shortValue: "MSK",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Nicosia",
//     value: "Europe/Nicosia",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Oslo",
//     value: "Europe/Oslo",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Paris",
//     value: "Europe/Paris",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Podgorica",
//     value: "Europe/Podgorica",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Prague",
//     value: "Europe/Prague",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Riga",
//     value: "Europe/Riga",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Rome",
//     value: "Europe/Rome",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/San_Marino",
//     value: "Europe/San_Marino",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Sarajevo",
//     value: "Europe/Sarajevo",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(MSK +03:00) Europe/Simferopol",
//     value: "Europe/Simferopol",
//     shortValue: "MSK",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Skopje",
//     value: "Europe/Skopje",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Sofia",
//     value: "Europe/Sofia",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Stockholm",
//     value: "Europe/Stockholm",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Tallinn",
//     value: "Europe/Tallinn",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Tirane",
//     value: "Europe/Tirane",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Tiraspol",
//     value: "Europe/Tiraspol",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Uzhgorod",
//     value: "Europe/Uzhgorod",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Vaduz",
//     value: "Europe/Vaduz",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Vatican",
//     value: "Europe/Vatican",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Vienna",
//     value: "Europe/Vienna",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Vilnius",
//     value: "Europe/Vilnius",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(MSK +03:00) Europe/Volgograd",
//     value: "Europe/Volgograd",
//     shortValue: "MSK",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Warsaw",
//     value: "Europe/Warsaw",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Zagreb",
//     value: "Europe/Zagreb",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(EET +02:00) Europe/Zaporozhye",
//     value: "Europe/Zaporozhye",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) Europe/Zurich",
//     value: "Europe/Zurich",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(GMT +00:00) GB",
//     value: "GB",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) GB-Eire",
//     value: "GB-Eire",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) GMT",
//     value: "GMT",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) GMT+0",
//     value: "GMT+0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) GMT-0",
//     value: "GMT-0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) GMT0",
//     value: "GMT0",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(GMT +00:00) Greenwich",
//     value: "Greenwich",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(HKT +08:00) Hongkong",
//     value: "Hongkong",
//     shortValue: "HKT",
//   },
//   {
//     displayName: "(HST −10:00) HST",
//     value: "HST",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(GMT +00:00) Iceland",
//     value: "Iceland",
//     shortValue: "GMT",
//   },
//   {
//     displayName: "(EAT +03:00) Indian/Antananarivo",
//     value: "Indian/Antananarivo",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(EAT +03:00) Indian/Comoro",
//     value: "Indian/Comoro",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(EAT +03:00) Indian/Mayotte",
//     value: "Indian/Mayotte",
//     shortValue: "EAT",
//   },
//   {
//     displayName: "(IST +02:00) Israel",
//     value: "Israel",
//     shortValue: "IST",
//   },
//   {
//     displayName: "(EST −05:00) Jamaica",
//     value: "Jamaica",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(JST +09:00) Japan",
//     value: "Japan",
//     shortValue: "JST",
//   },
//   {
//     displayName: "(EET +02:00) Libya",
//     value: "Libya",
//     shortValue: "EET",
//   },
//   {
//     displayName: "(CET +01:00) MET",
//     value: "MET",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(PST −08:00) Mexico/BajaNorte",
//     value: "Mexico/BajaNorte",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(MST −07:00) Mexico/BajaSur",
//     value: "Mexico/BajaSur",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CST −06:00) Mexico/General",
//     value: "Mexico/General",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(MST −07:00) MST",
//     value: "MST",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(MST −07:00) MST7MDT",
//     value: "MST7MDT",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(MST −07:00) Navajo",
//     value: "Navajo",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(NZST +12:00) NZ",
//     value: "NZ",
//     shortValue: "NZST",
//   },
//   {
//     displayName: "(NZST +12:00) Pacific/Auckland",
//     value: "Pacific/Auckland",
//     shortValue: "NZST",
//   },
//   {
//     displayName: "(ChST +10:00) Pacific/Guam",
//     value: "Pacific/Guam",
//     shortValue: "ChST",
//   },
//   {
//     displayName: "(HST −10:00) Pacific/Honolulu",
//     value: "Pacific/Honolulu",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(HST −10:00) Pacific/Johnston",
//     value: "Pacific/Johnston",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(SST −11:00) Pacific/Midway",
//     value: "Pacific/Midway",
//     shortValue: "SST",
//   },
//   {
//     displayName: "(SST −11:00) Pacific/Pago_Pago",
//     value: "Pacific/Pago_Pago",
//     shortValue: "SST",
//   },
//   {
//     displayName: "(ChST +10:00) Pacific/Saipan",
//     value: "Pacific/Saipan",
//     shortValue: "ChST",
//   },
//   {
//     displayName: "(SST −11:00) Pacific/Samoa",
//     value: "Pacific/Samoa",
//     shortValue: "SST",
//   },
//   {
//     displayName: "(CET +01:00) Poland",
//     value: "Poland",
//     shortValue: "CET",
//   },
//   {
//     displayName: "(WET +00:00) Portugal",
//     value: "Portugal",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(CST +08:00) PRC",
//     value: "PRC",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(PST −08:00) PST8PDT",
//     value: "PST8PDT",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(CST +08:00) ROC",
//     value: "ROC",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(KST +09:00) ROK",
//     value: "ROK",
//     shortValue: "KST",
//   },
//   {
//     displayName: "(UTC +00:00) UCT",
//     value: "UCT",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(UTC +00:00) Universal",
//     value: "Universal",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(AKST −09:00) US/Alaska",
//     value: "US/Alaska",
//     shortValue: "AKST",
//   },
//   {
//     displayName: "(HST −10:00) US/Aleutian",
//     value: "US/Aleutian",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(MST −07:00) US/Arizona",
//     value: "US/Arizona",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(CST −06:00) US/Central",
//     value: "US/Central",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) US/East-Indiana",
//     value: "US/East-Indiana",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(EST −05:00) US/Eastern",
//     value: "US/Eastern",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(HST −10:00) US/Hawaii",
//     value: "US/Hawaii",
//     shortValue: "HST",
//   },
//   {
//     displayName: "(CST −06:00) US/Indiana-Starke",
//     value: "US/Indiana-Starke",
//     shortValue: "CST",
//   },
//   {
//     displayName: "(EST −05:00) US/Michigan",
//     value: "US/Michigan",
//     shortValue: "EST",
//   },
//   {
//     displayName: "(MST −07:00) US/Mountain",
//     value: "US/Mountain",
//     shortValue: "MST",
//   },
//   {
//     displayName: "(PST −08:00) US/Pacific",
//     value: "US/Pacific",
//     shortValue: "PST",
//   },
//   {
//     displayName: "(SST −11:00) US/Samoa",
//     value: "US/Samoa",
//     shortValue: "SST",
//   },
//   {
//     displayName: "(UTC +00:00) UTC",
//     value: "UTC",
//     shortValue: "UTC",
//   },
//   {
//     displayName: "(MSK +03:00) W-SU",
//     value: "W-SU",
//     shortValue: "MSK",
//   },
//   {
//     displayName: "(WET +00:00) WET",
//     value: "WET",
//     shortValue: "WET",
//   },
//   {
//     displayName: "(UTC +00:00) Zulu",
//     value: "Zulu",
//     shortValue: "UTC",
//   },
// ];
// export const getLocalTimeZone =
//   Intl.DateTimeFormat().resolvedOptions().timeZone;

// export function fnCheckValidationOfObject(obj) {
//   let IsValid = true;
//   if (obj?.errors !== null) {
//     if (obj?.errors?.ValidationRules) {
//       for (let i = 0; i < obj.errors.ValidationRules.length; i++) {
//         obj.errors[obj.errors.ValidationRules[i].FieldName] = "";
//       }

//       for (let i = 0; i < obj.errors.ValidationRules.length; i++) {
//         let objRules = obj.errors.ValidationRules[i];

//         if (objRules !== null) {
//           if (objRules.ValidationType.toLowerCase() === "required") {
//             if (
//               obj[objRules.FieldName] === "" ||
//               obj[objRules.FieldName] === null ||
//               obj[objRules.FieldName] === undefined
//             ) {
//               IsValid = false;
//               obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//             }
//           }
//           if (
//             obj[objRules.FieldName] !== "" &&
//             obj[objRules.FieldName] !== null &&
//             obj[objRules.FieldName] !== undefined
//           ) {
//             //  Range validation
//             if (objRules.ValidationType.toLowerCase() === "range") {
//               if (objRules.FieldName === "password") {
//                 if (obj.password.length < 6) {
//                   IsValid = false;
//                   obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//                 }
//               }
//               if (objRules.FieldName === "new_password") {
//                 if (obj.new_password.length < 6) {
//                   IsValid = false;
//                   obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//                 }
//               }
//             }

//             // Masking Validation
//             if (objRules.ValidationType.toLowerCase() === "mobile-mask") {
//               // if (!obj[objRules.FieldName].toString().match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)) {
//               if (!obj[objRules.FieldName].toString().match(/^[0-9]{10}$/)) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }

//             // Email Validation
//             if (
//               obj.errors[objRules.FieldName] === "" &&
//               objRules.ValidationType.toLowerCase() === "email"
//             ) {
//               var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//               obj[objRules.FieldName] = obj[objRules.FieldName]?.trim();
//               if (
//                 !obj[objRules.FieldName].toString().trim().match(mailformat)
//               ) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }

//             //  Number validation
//             if (
//               objRules.ValidationType.toLowerCase() === "number" &&
//               obj.errors[objRules.FieldName] === ""
//             ) {
//               var mailformat = /^[0-9]/;
//               if (!obj[objRules.FieldName].toString().match(mailformat)) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }

//             //  Compare Field Value

//             if (
//               obj.errors[objRules.FieldName] === "new_password" &&
//               obj.errors[objRules.CompareFieldName] ===
//               "confirm_new_password" &&
//               objRules.ValidationType.toLowerCase() === "comparefieldvalue"
//             ) {
//               // var mailformat = /^[0-9]*$/;

//               if (obj[objRules.FieldName] !== obj[objRules.CompareFieldName]) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }

//             //date validation
//             if (objRules.ValidationType.toLowerCase() === "date") {
//               if (moment(obj[objRules.FieldName]) <= moment("1900-01-01")) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }
//             if (objRules.ValidationType.toLowerCase() === "checkbox") {
//               if (obj[objRules.FieldName].length === 0) {
//                 IsValid = false;
//                 obj.errors[objRules.FieldName] = objRules.ValidationMessage;
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   setTimeout(() => {
//     let ApplyClass =
//       document.getElementsByClassName(`input-error-common`).length !== 0
//         ? "input-error-common"
//         : "is-invalid";
//     FocusOnValidationField(ApplyClass);
//   }, 500);

//   return { isValid: IsValid, obj: obj };
// }
// function FocusOnValidationField(errClass) {
//   const curr_Element = document.querySelector(`.${errClass}`);
//   if (curr_Element) {
//     curr_Element.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//     return;
//   }
// }
// export function fnCommonValueFill(value, tag, obj, mainState, page) {
//   let updatedValue = { ...obj };
//   if (updatedValue?.errors !== null) {
//     if (value !== "") {
//       updatedValue[tag] = value;
//       updatedValue.errors = {
//         ...updatedValue?.errors,
//         [tag]: "",
//       };
//     }
//   }
//   mainState(updatedValue);
// }
// function setItem(key, strString) {
//   localStorage.setItem(key, strString);
// }
// function getLocalTime(time) {
//   if (time) {
//     return new Date(time).toLocaleTimeString([], {
//       hour12: false,
//     });
//   }
// }
// function getLocalTimeAMPM(time) {
//   if (time) {
//     // If time is in UTC, convert it to local time
//     return moment.utc(time).local().format("hh:mm A");
//   } else {
//     return "";
//   }
// }
// function getItem(key) {
//   return localStorage.getItem(key) || "";
// }
// function removeItem(key) {
//   if (localStorage.getItem(key)) {
//     localStorage.removeItem(key);
//   }
// }
// function getHeaders() {
//   return {
//     "Content-Type": "application/json",
//     accept: "*/*",
//     // Authorization: "Bearer " + getItem("token"),
//     Authorization: "Bearer " + getDecryptData("token"),
//   };
// }
// function getHeadersFromData() {
//   return {
//     "Content-Type": "multipart/form-data",
//     accept: "*/*",
//     // Authorization: "Bearer " + getItem("token"),
//     Authorization: "Bearer " + getDecryptData("token"),
//   };
// }
// function showAlert(title, icon, timer = 3000) {
//   Swal.fire({
//     title,
//     icon,
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer,
//     timerProgressBar: true,
//   });
// }
// function cropImage(imageSrc, cropArea) {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.src = imageSrc;

//     image.onload = () => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = cropArea.width;
//       canvas.height = cropArea.height;

//       ctx.drawImage(
//         image,
//         cropArea.x,
//         cropArea.y,
//         cropArea.width,
//         cropArea.height,
//         0,
//         0,
//         cropArea.width,
//         cropArea.height
//       );

//       canvas.toBlob(
//         (blob) => {
//           if (!blob) {
//             reject(new Error("Canvas is empty"));
//             return;
//           }
//           const file = new File([blob], `${Date.now()}.png`, {
//             type: "image/png",
//           });
//           resolve(file);
//         },
//         "image/png",
//         1
//       );
//     };

//     image.onerror = (error) => reject(error);
//   });
// }
// function setEncryptData(key, strString) {
//   localStorage.setItem(
//     key,
//     CryptoJS.AES.encrypt(strString, cryptoKey).toString()
//   );
// }
// function getDecryptData(key) {
//   let dataValues = localStorage.getItem(key) || "";
//   if (!dataValues) return "";
//   let bytes = CryptoJS.AES.decrypt(dataValues, cryptoKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// }
// function clearLocalStorage() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("ProjectInfo");
//   localStorage.removeItem("UserInfo");
//   localStorage.removeItem("ClientInfo");
//   localStorage.removeItem("CustomerInfo");
//   localStorage.removeItem("WorkspaceInfo");
//   localStorage.removeItem("UserRoleRight");
//   localStorage.removeItem("t");
//   localStorage.removeItem("AgentSidebar");
//   localStorage.removeItem("CampaignID");
//   localStorage.clear();
// }
export function getDateInFormat(date) {
    return date ? moment(date).format("MM/DD/YYYY") : "";
}

// function getDateInHHMMSSFormat(date) {
//   return date ? moment.utc(date).local().format("hh:mm:ss") : "";
// }

// function getFullDateTimeInFormat(date, timezone) {
//   //   return date ? moment.tz(date, timezone).format("MM/DD/YYYY - hh:mm:ss") : "";
//   return moment.utc(date).tz(timezone).format("YYYY-MM-DD HH:mm:ss");
// }
// // function getFullDateTimeInFormat(date) {
// //   return date ? moment(date).local().format("MM/DD/YYYY - hh:mm:ss A") : "";
// // }

// function getTimeInFormatForTwillio(time) {
//   if (!time) return "";
//   const m = moment(time, "HH:mm", true);
//   if (m.isValid()) {
//     return m.format("HH:mm:ss A");
//   }
//   const m2 = moment(time);
//   return m2.isValid() ? m2.format("HH:mm:ss A") : "";
// }
// function getTimeInFormat(date, timezone) {
//   if (date) {
//     const localTime = moment.tz(
//       date,
//       "YYYY-MM-DD HH:mm:ss",
//       timezone || localTimezone
//     );
//     return localTime.format("HH:mm:ss");
//   }
//   return "";
// }
// function getPassUTCDateTime(date, timezone) {
//   return date ? moment.tz(date, timezone).format("YYYY-MM-DD hh:mm:ss") : "";
// }

// function getDateInGivenFormat(date, format) {
//   return date ? moment.tz(date, localTimezone).format(format) : "";
//   // return date ? moment(date).format(format) : "";
// }
// function DurationfromSeconds(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;
//   return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds > 0 ? parseInt(remainingSeconds) + "s" : "0s"
//     }`;
// }
// export function getSentimentIcon(experience) {
//   const sentiments = {
//     "very positive": verypositive,
//     // positive: "😃",
//     // neutral: "😐",
//     // negative: "☹️",
//     // "very negative": "😡",
//     positive,
//     neutral,
//     negative,
//     "very negative": verynegative,
//   };

//   // return sentiments[experience?.toLowerCase()] || "N/A";
//   return sentiments[experience?.toLowerCase()] || null;
// }
// function DashboardCardIcon(value) {
//   if (value) {
//     if (value === "total_workspaces") {
//       return workspaceone;
//     } else if (value === "total_clients") {
//       return Clienticon;
//     } else if (value === "total_projects") {
//       return Project;
//     } else if (value === "total_credits") {
//       return CreditcoinIcon;
//     } else {
//       return session;
//     }
//   }
// }
// function stripHTML(html) {
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = html;
//   return tempDiv.textContent || tempDiv.innerText || "";
// }
// function truncateText(text, length) {
//   return text?.length > length ? text?.substring(0, length) + "..." : text;
// }
// async function getVectorStore({ code, setLoading, bindlist, onhide, type }) {
//   setLoading(true);
//   try {
//     const resData = await apiCall(
//       {
//         method: "POST",
//         url: API_URL.BASEURL_FILE_VECTORSTORE + API_URL.VECTOR.DB,
//         body: { unique_code: code },
//       },
//       false
//     );
//     if (resData?.status === "success") {
//       commonService.showAlert(
//         type === "create" ? resData.message : "knowledge deleted Successfully.",
//         "success"
//       );
//       bindlist();
//       onhide();
//     } else {
//       setLoading(false);
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// }
// function getLoginRoleData(PageName, ActionType) {
//   const roledataStr = useSelector((state) => state?.userinfo?.UserRoleRight);
//   function checkRole(role) {
//     if (
//       role?.module_name &&
//       role?.module_name.toUpperCase() === PageName?.toUpperCase()
//     ) {
//       if (ActionType.toUpperCase() === "ISVIEW") {
//         return !!role.is_view;
//       } else if (ActionType.toUpperCase() === "ISCREATE") {
//         return !!role.is_create;
//       } else if (ActionType.toUpperCase() === "ISUPDATE") {
//         return !!role.is_update;
//       } else if (ActionType.toUpperCase() === "ISDELETE") {
//         return !!role.is_delete;
//       } else {
//         return false;
//       }
//     } else if (Array.isArray(role.children) && role.children.length > 0) {
//       for (let i = 0; i < role.children.length; i++) {
//         const found = checkRole(role.children[i]);
//         if (found !== false) {
//           return found;
//         }
//       }
//       return false;
//     } else {
//       return false;
//     }
//   }
//   for (let i = 0; i < roledataStr?.length; i++) {
//     const found = checkRole(roledataStr[i]);
//     if (found !== false) {
//       return found;
//     }
//   }
//   return false;
// }
// // function getProjectRoleData(PageName, ActionType) {
// //   let IsValidAction = false;
// //   var projectroledata = [];
// //   const projectroledataStr = useSelector(
// //     (state) => state.userinfo?.ProjectRoleRight
// //   );
// //   if (projectroledataStr !== "") {
// //     projectroledata = projectroledataStr;
// //     for (let i = 0; i < projectroledata?.length; i++) {
// //       if (
// //         projectroledata[i].module_name.toUpperCase() === PageName.toUpperCase()
// //       ) {
// //         if (ActionType.toUpperCase() === "ISVIEW") {
// //           return projectroledata[i].is_view;
// //         } else if (ActionType.toUpperCase() === "ISCREATE") {
// //           return projectroledata[i].is_create;
// //         } else if (ActionType.toUpperCase() === "ISDELETE") {
// //           return projectroledata[i].is_delete;
// //         } else if (ActionType.toUpperCase() === "ISUPDATE") {
// //           return projectroledata[i].is_update;
// //         }
// //       }
// //     }
// //   }
// //   return IsValidAction;
// // }
// function getEncodedValue(value) {
//   if (value) {
//     const strValue = String(value);
//     const b64 = btoa(strValue);
//     const urlSafeId = encodeURIComponent(b64);
//     return urlSafeId;
//   }
// }
// function getFilterInputByRegex(input, pattern) {
//   const regex = new RegExp(pattern, "g");
//   return input.match(regex)?.join("") || "";
// }
// function getNumberValue(value) {
//   if (value !== "" && value !== undefined && value !== null) {
//     if (value >= 1000000) {
//       return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + "M";
//     } else if (value >= 1000) {
//       return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "K";
//     } else {
//       return value.toString();
//     }
//   }
//   return "";
// }
// export function formatNumberWithCommas(number) {
//   if (typeof number !== "number") {
//     const parsed = Number(number);
//     if (isNaN(parsed)) return number;
//     number = parsed;
//   }
//   return number.toLocaleString("en-US");
// }
// async function getCountryCodeByIP() {
//   try {
//     const response = await fetch(`https://ipinfo.io/json?token=${IP_INFO_KEY}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching IP location:", error);
//     return null;
//   }
// }
// function maskEmail(email) {
//   const [local, domain] = email?.split("@");
//   if (local?.length <= 3) {
//     return "*".repeat(local.length) + "@" + domain;
//   } else {
//     const visiblePart = local.slice(-3);
//     const maskedPart = "*".repeat(local.length - 3);
//     return maskedPart + visiblePart + "@" + domain;
//   }
// }
// // export function validateAndFormatMobileNumber(fieldName, input, setInput) {
// //   let hasError = false;
// //   const phoneValue = input[fieldName];
// //   if (!phoneValue) {
// //     hasError = true;
// //     setInput((prevState) => ({
// //       ...prevState,
// //       errors: {
// //         ...prevState.errors,
// //         [fieldName]: "This is required field.",
// //       },
// //     }));
// //   } else {
// //     const parsedNumber = parsePhoneNumberFromString(phoneValue);
// //     if (!parsedNumber || !parsedNumber.isValid()) {
// //       hasError = true;
// //       setInput((prevState) => ({
// //         ...prevState,
// //         errors: {
// //           ...prevState.errors,
// //           [fieldName]: "Invalid phone number for selected country.",
// //         },
// //       }));
// //     } else {
// //       const formattedNumber = `+${parsedNumber.countryCallingCode}${parsedNumber.nationalNumber}`;
// //       setInput((prevState) => ({
// //         ...prevState,
// //         [fieldName]: formattedNumber,
// //         errors: {
// //           ...prevState.errors,
// //           [fieldName]: "",
// //         },
// //       }));
// //     }
// //   }

// //   return hasError;
// // }
// function validateURL(url) {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// }
// // export function fnEncryptValue(value) {
// //   if (value) {
// //     return CryptoJS.AES.encrypt(value, cryptoKey).toString();
// //   }
// // }
// // export function fnDecryptValue(value) {
// //   if (value) {
// //     return CryptoJS.AES.decrypt(value, cryptoKey).toString(CryptoJS.enc.Utf8);
// //   }
// // }
// export function fnEncryptValue(value) {
//   if (value) {
//     const encrypted = CryptoJS.AES.encrypt(value, cryptoKey).toString();
//     return encodeURIComponent(encrypted);
//   }
//   return "";
// }
// export function fnDecryptValue(value) {
//   if (value) {
//     const decoded = decodeURIComponent(value);
//     return CryptoJS.AES.decrypt(decoded, cryptoKey).toString(CryptoJS.enc.Utf8);
//   }
//   return "";
// }
// export function fnorderonName(value) {
//   if (value === "Project") {
//     return "project_name";
//   } else {
//     return value;
//   }
// }
// export function getDaysLeft(targetDate) {
//   if (!targetDate) return "";

//   const currentDate = new Date();
//   const endDate = new Date(targetDate);

//   // Zero out the time part for accurate day difference
//   currentDate.setHours(0, 0, 0, 0);
//   endDate.setHours(0, 0, 0, 0);

//   const diffTime = endDate - currentDate;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays > 0) {
//     return `${diffDays} Day${diffDays > 1 ? "s" : ""} Left`;
//   } else if (diffDays === 0) {
//     return "Today";
//   } else {
//     return "Expired";
//   }
// }
// export function fnCreditCardImg(value) {
//   if (value === "visa") {
//     return VisaIcon;
//   } else if (value === "mastercard") {
//     return MastercardImg;
//   } else if (value === "amex") {
//     return AmaxIcon;
//   } else if (value === "discover") {
//     return DiscoverIcon;
//   } else if (value === "rupay") {
//     return RupayIcon;
//   }
// }
// export function getProgressBarColor(percentage) {
//   if (percentage >= 80) return "bg-success";
//   if (percentage >= 60) return "bg-light-green";
//   if (percentage >= 40) return "bg-warning";
//   return "bg-danger";
// }

// export function getTextColor(percentage) {
//   if (percentage >= 80) return "text-success";
//   if (percentage >= 60) return "text-light-green";
//   if (percentage >= 40) return "text-warning";
//   return "text-danger";
// }

// export function getStatusBadgeClass(percentage) {
//   if (percentage >= 90) return "percentage-90";
//   if (percentage >= 80) return "percentage-80";
//   if (percentage >= 60) return "percentage-70";
//   if (percentage >= 40) return "percentage-40";
//   return "percentage-20";
// }
// export function getTextStatusColor(percentage) {
//   if (percentage >= 90) return "marks-green";
//   if (percentage >= 80) return "marks-light-green";
//   if (percentage >= 60) return "marks-yellow";
//   if (percentage >= 40) return "marks-orange";
//   return "marks-red";
// }
// export function getCampaignIcon(val) {
//   if (val === "sms") {
//     return SmsIcon;
//   } else if (val === "x") {
//     return Xicon;
//   } else if (val === "email") {
//     return EmailIcon;
//   } else if (val === "instagram") {
//     return InstagramIcon;
//   } else if (val === "whatsapp") {
//     return WhatsappIcon;
//   } else if (val === "voice") {
//     return VoiceIcon;
//   } else if (val === "facebook") {
//     return FacebookIcon;
//   } else if (val === "rcs") {
//     return RcsIcon;
//   } else if (val === "linkedin") {
//     return LinkedInIcon;
//   }
// }
