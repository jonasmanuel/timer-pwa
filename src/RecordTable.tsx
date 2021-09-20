import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { Record } from "./App";

export function RecordTable({
  records,
  onDelete,
  onArchive,
}: {
  records: Record[];
  onDelete: (record: Record) => void;
  onArchive: (record: Record, archive: boolean) => void;
}) {
  const [showArchived, setShowArchived] = useState<boolean>(false);
  return (
    <TableContainer component={Paper} sx={{ margin: 1, width: (theme) => `calc(100% - ${theme.spacing(2)})` }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Dauer</TableCell>
            <TableCell>Gespeichert am</TableCell>
            <TableCell>
              <FormControlLabel
                control={<Checkbox checked={showArchived} onChange={() => setShowArchived((x) => !x)}></Checkbox>}
                label="Show Archived"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records
            .filter((r) => showArchived || !r.archived)
            .map((record) => {
              return (
                <TableRow key={record.id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>
                    {Math.round(moment.duration(record.recordedTime, "milliseconds").asHours() * 10) / 10} h
                  </TableCell>
                  <TableCell> CW {moment(new Date(record.recordedDate)).format("WW DD.MM.yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onDelete(record)}>
                      <DeleteIcon />
                    </IconButton>
                    {record.archived ? (
                      <IconButton onClick={() => onArchive(record, false)}>
                        <UnarchiveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => onArchive(record, true)}>
                        <ArchiveIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
