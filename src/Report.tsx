import {
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import _ from "lodash";
import moment from "moment";
import { Record } from "./App";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useState } from "react";

export const Report = ({ records }: { records: Record[] }) => {
  records.sort((a, b) => a.recordedDate - b.recordedDate);
  const cws = _(records)
    .map((r) => moment(new Date(r.recordedDate)).format("WW"))
    .uniq()
    .value();
  const byCw = _(records).groupBy((r) => moment(new Date(r.recordedDate)).format("WW"));
  const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
  return (
    <>
      {cws.map((cw) => {
        const cwRecords = byCw.get(cw);
        const projects = _(cwRecords)
          .map((r) => (r.project ? r.project : { name: r.name, psp: "" }))
          .uniqBy("name")
          .value();
        const byProject = _(cwRecords).groupBy("name");
        return (
          <>
            <h5 style={{ marginLeft: 8 }}>CW{cw}</h5>
            <TableContainer component={Paper} sx={{ margin: 1, width: (theme) => `calc(100% - ${theme.spacing(2)})` }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PSP</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Mo</TableCell>
                    <TableCell>Tu</TableCell>
                    <TableCell>We</TableCell>
                    <TableCell>Th</TableCell>
                    <TableCell>Fr</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => {
                    const records = byProject.get(project.name);
                    const daySums = [0, 0, 0, 0, 0, 0, 0];
                    for (const record of records) {
                      const day = new Date(record.recordedDate).getDay() - 1; // 0 == sunday
                      daySums[day] += record.recordedTime;
                    }
                    const dayStrings = daySums.map((sum) =>
                      (Math.round(moment.duration(sum, "milliseconds").asHours() * 10) / 10).toLocaleString()
                    );
                    return (
                      <TableRow key={project.name}>
                        <TableCell>{project.psp}</TableCell>
                        <TableCell>{project.name}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{dayStrings[0]}</TableCell>
                        <TableCell>{dayStrings[1]}</TableCell>
                        <TableCell>{dayStrings[2]}</TableCell>
                        <TableCell>{dayStrings[3]}</TableCell>
                        <TableCell>{dayStrings[4]}</TableCell>
                        <TableCell>
                          <Tooltip title="Copy Values">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${dayStrings[0]}\t${dayStrings[1]}\t${dayStrings[2]}\t${dayStrings[3]}\t${dayStrings[4]}`
                                );
                                setSnackBarOpen(true);
                              }}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy PSP and Values">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${project.psp}\t\t\t${dayStrings[0]}\t${dayStrings[1]}\t${dayStrings[2]}\t${dayStrings[3]}\t${dayStrings[4]}`
                                );
                                setSnackBarOpen(true);
                              }}
                            >
                              <FileCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Snackbar open={snackBarOpen} onClose={() => setSnackBarOpen(false)} message="Copied to Clipboard" />
          </>
        );
      })}
    </>
  );
};
