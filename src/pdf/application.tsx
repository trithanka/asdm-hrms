import { LoadingButton } from "@mui/lab"
import { useRef } from "react";
import { IoMdDownload } from "react-icons/io";
import generatePDF from 'react-to-pdf';
import useFetchLeaveApplicationDetails from "../features/leave-application/useFetchLeaveApplicationDetails";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils/formatter";



const LeaveApplication = () => {
    const navigate = useNavigate();
    const params = useParams();
    const applicationId = params.id;

    const { data: details, isPending } = useFetchLeaveApplicationDetails(applicationId);
    if (!applicationId) return <>{ navigate(-1) }</>;
    const targetRef = useRef<HTMLDivElement>(null);

    if (!isPending) {
        console.log("details", details?.data[0]);
    }

    return isPending ? (
        <p>Loading...</p>
    )
        :
        (

            <>
                <div style={ { display: "flex", justifyContent: "end", paddingRight: 10 } }>
                    <LoadingButton
                        onClick={ () => generatePDF(targetRef, { filename: 'leave-application.pdf' }) }
                        sx={ { gap: 2 } }>
                        <IoMdDownload size={ 20 } />
                        Download
                    </LoadingButton>
                </div>
                <div ref={ targetRef } style={ { paddingTop: 40 } }>
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <title>f50933af-3002-4b3f-877a-60887bfe3fee</title>
                    <meta name="author" content="EGM2" />
                    <style
                        type="text/css"
                        dangerouslySetInnerHTML={ {
                            __html:
                                ' * { margin:0; padding:0; text-indent:0; }\n                h1 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: bold; text-decoration: underline; font-size: 14pt; }\n                .s1 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 11pt; }\n                .s2 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 10pt; }\n                .s5 { color: black; font-family:Calibri, sans-serif; font-style: italic; font-weight: bold; text-decoration: none; font-size: 11pt; }\n                h2 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: bold; text-decoration: underline; font-size: 12pt; }\n                p { color: black; font-family:Calibri, sans-serif; font-style: italic; font-weight: bold; text-decoration: none; font-size: 10pt; margin:0pt; }\n                h3 { color: black; font-family:Calibri, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 11pt; }\n                li { display: block; }\n                #l1 { padding - left: 0pt;counter-reset: c1 1; }\n #l1> li>*:first-child:before { counter - increment: c1; content: counter(c1, decimal)". "; color: black; font-family:Calibri, sans-serif; font-style: italic; font-weight: bold; text-decoration: none; font-size: 10pt; }\n #l1> li:first-child>*:first-child:before { counter - increment: c1 0;  }\n                table, tbody { vertical - align: top; overflow: visible; }\n            '
                        } }
                    />
                    <h1 style={ { textIndent: "0pt", lineHeight: "17pt", textAlign: "center" } }>
                        STANDARD FORMAT OF APPLICATION
                    </h1>
                    <h1 style={ { textIndent: "0pt", lineHeight: "17pt", textAlign: "center" } }>
                        { " " }
                        FOR CASUAL LEAVE / MEDICAL LEAVE
                    </h1>
                    <p style={ { textIndent: "0pt", textAlign: "left" } }>
                        <br />
                    </p>
                    <div style={ { display: "flex", justifyContent: "center", alignItems: "center" } }>
                        <table
                            style={ { borderCollapse: "collapse", marginLeft: "5.634pt" } }
                            cellSpacing={ 0 }
                        >
                            <tbody>
                                <tr style={ { height: "27pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            1
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Name of the Applicant
                                        </p>
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "7pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            (Block Letter):
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p className="s1" style={ { textIndent: "0pt", textAlign: "left", paddingLeft: 10 } }>
                                            { details?.data[0]?.name }<br />
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "22pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            2
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Post Held:
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p className="s1" style={ { textIndent: "0pt", textAlign: "left", paddingLeft: 10 } }>
                                            { details?.data[0]?.designation }<br />
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "19pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            3
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Nature of Leave
                                        </p>
                                        <p
                                            className="s2"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            (Casual Leave / Medical Leave/
                                            <i>station leave with CL / Station Leave with ML</i>
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p className="s1" style={ { textIndent: "0pt", textAlign: "left", paddingLeft: 10 } }>
                                            { details?.data[0]?.type } <br />
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "27pt" } }>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            No. of days applied CL/ML: { details?.data[0]?.leaveDuration == 1 ? details?.data[0]?.leaveDuration + " day" : details?.data[0]?.leaveDuration + " days" }
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "41pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                textIndent: "0pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            4
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Period of leave applied for:
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            From :{ " " }
                                            <u>
                                                { formatDate(details?.data[0]?.startDate) } &nbsp;&nbsp;&nbsp;&nbsp;{ " " }
                                            </u>
                                            to{ " " }
                                            <u>
                                                { formatDate(details?.data[0]?.endDate) } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </u>
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "41pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            5
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            No. of Prefix and Suffix holidays (if any) during applied Leave
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Date of Prefix holidays :{ " " }
                                            <u>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </u>
                                        </p>
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "7pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Date of suffix holidays :
                                            <u>
                                                { " " }
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </u>
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "121pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                                            <br />
                                        </p>
                                        <p
                                            className="s1"
                                            style={ { textIndent: "0pt", textAlign: "center" } }
                                        >
                                            6
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                                            <br />
                                        </p>
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "9pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Ground on which leave applied for:
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                                            <br />
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "27pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                textIndent: "0pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            7
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                paddingRight: "46pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Date of Last Leave Taken: (<i>To be filled by the HR)</i>
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Casual Leave : { details?.data[0]?.lastCLDate !== null ? formatDate(details?.data[0]?.lastCLDate) : details?.data[0]?.lastCLDate }
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "18pt" } }>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Medical Leave : { details?.data[0]?.lastMLDate !== null ? formatDate(details?.data[0]?.lastMLDate) : details?.data[0]?.lastMLDate }
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "27pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                textIndent: "0pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            8
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                        rowSpan={ 2 }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Total No. of balance Leaves in the Current Year:
                                        </p>
                                        <p
                                            className="s5"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            (To be filled by HR)
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Casual Leave : { details?.data[0]?.clLeaveBalance }
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "27pt" } }>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Medical Leave : { details?.data[0]?.mlLeaveBalance }
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "54pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                textIndent: "0pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            9
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingTop: "13pt",
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Medical Prescription &amp; other details
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                paddingRight: "226pt",
                                                textIndent: "0pt",
                                                lineHeight: "27pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Name of Doctor: Date of Prescription:
                                        </p>
                                    </td>
                                </tr>
                                <tr style={ { height: "45pt" } }>
                                    <td
                                        style={ {
                                            width: "23pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "center"
                                            } }
                                        >
                                            10
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "180pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Officer /Staff requested to look after urgent work during his/her
                                            absence:
                                        </p>
                                    </td>
                                    <td
                                        style={ {
                                            width: "329pt",
                                            borderTopStyle: "solid",
                                            borderTopWidth: "1pt",
                                            borderLeftStyle: "solid",
                                            borderLeftWidth: "1pt",
                                            borderBottomStyle: "solid",
                                            borderBottomWidth: "1pt",
                                            borderRightStyle: "solid",
                                            borderRightWidth: "1pt"
                                        } }
                                    >
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                lineHeight: "13pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Name :
                                        </p>
                                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                                            <br />
                                        </p>
                                        <p
                                            className="s1"
                                            style={ {
                                                paddingLeft: "5pt",
                                                textIndent: "0pt",
                                                textAlign: "left"
                                            } }
                                        >
                                            Designation:
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={ { paddingLeft: 250, paddingRight: 250 } }>
                        <h2 style={ { paddingLeft: "11pt", textIndent: "0pt", textAlign: "left" } }>
                            N.B:
                        </h2>
                        <ol id="l1">
                            <li data-list-text={ 1 }>
                                <p
                                    style={ {
                                        paddingTop: "2pt",
                                        paddingLeft: "11pt",
                                        textIndent: "0pt",
                                        lineHeight: "114%",
                                        textAlign: "left"
                                    } }
                                >
                                    For all application of Medical leave, it is mandatory to enclose
                                    doctor visit report/prescription. For minor ailments, where visit to
                                    doctor is not required and leave taken will be considered as casual
                                    leave.
                                </p>
                            </li>
                            <li data-list-text={ 2 }>
                                <p
                                    style={ { paddingLeft: "20pt", textIndent: "-9pt", textAlign: "left" } }
                                >
                                    For any planned leave, leave application to be submitted at least one
                                    week prior, for approval.
                                </p>
                            </li>
                            <li data-list-text={ 3 }>
                                <p
                                    style={ {
                                        paddingTop: "1pt",
                                        paddingLeft: "11pt",
                                        textIndent: "0pt",
                                        lineHeight: "115%",
                                        textAlign: "left"
                                    } }
                                >
                                    If the claimed CL / ML contain Prefix holidays or suffix holidays,
                                    mention leave in column 3 as ‘station leave with CL’ / ‘Station Leave
                                    with ML’.
                                </p>
                            </li>
                        </ol>
                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <h3 style={ { paddingLeft: "13pt", textIndent: "0pt", textAlign: "left" } }>
                            Date: Signature of the Applicant
                        </h3>
                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <h3 style={ { paddingLeft: "11pt", textIndent: "0pt", textAlign: "left" } }>
                            Remarks /Recommendation of HR/Concerned officer{ " " }
                            <u>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </u>
                        </h3>
                        <p style={ { paddingTop: "6pt", textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <p
                            style={ {
                                paddingLeft: "11pt",
                                textIndent: "0pt",
                                lineHeight: "1pt",
                                textAlign: "left"
                            } }
                        />
                        <p style={ { paddingTop: "7pt", textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <h3 style={ { paddingLeft: "15pt", textIndent: "0pt", textAlign: "left" } }>
                            Date: Signature of HR/ Concerned Officer
                        </h3>
                        <h3
                            style={ {
                                paddingTop: "13pt",
                                paddingLeft: "11pt",
                                textIndent: "0pt",
                                textAlign: "left"
                            } }
                        >
                            Remarks of Controlling Officer{ " " }
                            <u>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </u>
                        </h3>
                        <p style={ { paddingTop: "6pt", textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <p
                            style={ {
                                paddingLeft: "11pt",
                                textIndent: "0pt",
                                lineHeight: "1pt",
                                textAlign: "left"
                            } }
                        />
                        <p style={ { textIndent: "0pt", textAlign: "left" } }>
                            <br />
                        </p>
                        <h3 style={ { paddingLeft: "11pt", textIndent: "0pt", textAlign: "left" } }>
                            Date: Signature of Controlling Officer
                        </h3>
                    </div>
                </div>
            </>
        );
}
export default LeaveApplication