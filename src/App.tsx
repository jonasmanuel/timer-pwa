import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Card, CardContent, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import { TimerCard } from "./TimerCard";
import AddIcon from "@mui/icons-material/Add";
import { Report } from "./Report";
import { ProjectCard } from "./ProjectCard";
import { RecordTable } from "./RecordTable";

export interface Record {
  id: number;
  name: string;
  recordedTime: number;
  recordedDate: number;
  project?: Project;
  archived?: boolean;
}

export interface Project {
  psp: string;
  name: string;
}

export interface Timer {
  id: number;
  name: string;
  elapsedTime: number;
  startTime: number;
  paused: boolean;
  project?: Project;
}

function App() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [nextId, setNextId] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectPsp, setProjectPsp] = useState<string>("");
  const [projectButtonEnabled, setProjectButtonEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (timers.length > 0 || records.length > 0) {
      localStorage.setItem(
        "timerData",
        JSON.stringify({ storageTimers: timers, storageRecords: records, storageId: nextId })
      );
    }
  }, [timers, records, nextId]);
  useEffect(() => {
    let timerData = localStorage.getItem("timerData");
    if (timerData) {
      let { storageTimers, storageRecords, storageId } = JSON.parse(timerData) as {
        storageTimers: Timer[];
        storageRecords: Record[];
        storageId: number;
      };
      setTimers(storageTimers);
      setNextId(storageId);
      setRecords(storageRecords);
    }
    const projectData = localStorage.getItem("projectData");
    if (projectData) {
      let { projects } = JSON.parse(projectData) as { projects: Project[] };
      setProjects(projects);
    }
  }, [setTimers, setRecords, setNextId, setProjects]);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem("projectData", JSON.stringify({ projects }));
  }, [projects]);

  const createTimer = (project?: Project) => {
    setTimers((curTimers) => {
      const newTimer: Timer = {
        id: nextId,
        name: newName,
        paused: false,
        elapsedTime: 0,
        startTime: new Date().getTime(),
      };
      if (project) {
        newTimer.name = project.name;
        newTimer.project = project;
        setProjects((pjs) => {
          const moved = pjs.filter((pj) => pj.psp !== project.psp);
          moved.push(project);
          return moved;
        });
      }
      setNewName("");
      setNextId((nid) => nid + 1);
      return curTimers.concat(newTimer);
    });
  };

  const createProject = () => {
    const newProject: Project = {
      name: projectName,
      psp: projectPsp,
    };
    setProjectPsp("");
    setProjectName("");
    setProjects((pjs) => pjs.concat(newProject));
  };
  const nameChanged = (value: string) => {
    setButtonEnabled(value.trim().length > 0);
    setNewName(value);
  };

  const projectNameChanged = (value: string) => {
    setProjectButtonEnabled(value.trim().length > 0 && projectPsp.length > 0);
    setProjectName(value.trim());
  };

  const projectPspChanged = (value: string) => {
    setProjectButtonEnabled(value.trim().length > 0 && projectName.length > 0);
    setProjectPsp(value.trim());
  };
  const onChange = (timer: Timer) => {
    const changedIndex = timers.findIndex((t) => t.id === timer.id);
    if (changedIndex > -1) {
      const timersChanged = timers.slice(0);
      timersChanged[changedIndex] = timer;
      setTimers(timersChanged);
    }
  };

  const onStop = (timer: Timer) => {
    setTimers(timers.filter((t) => t.id !== timer.id));
    setRecords((recs) =>
      recs.concat({
        id: timer.id,
        name: timer.name,
        recordedTime: timer.elapsedTime,
        recordedDate: new Date().getTime(),
        project: timer.project,
      })
    );
  };

  const deleteRecord = (record: Record) => {
    setRecords((recs) => recs.filter((rec) => rec.id !== record.id));
  };

  const archiveRecord = (record: Record, archive: boolean) => {
    record.archived = archive;
    const changedIndex = records.findIndex((r) => r.id === record.id);
    if (changedIndex > -1) {
      const recordsChanged = records.slice(0);
      recordsChanged[changedIndex] = record;
      setRecords(recordsChanged);
    }
  };
  return (
    <>
      <h2 style={{ marginLeft: 8 }}>Projects</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Card sx={{ margin: 1, width: 316 }}>
          <CardContent>
            <TextField
              label="Project Name"
              variant="standard"
              value={projectName}
              onChange={(e) => projectNameChanged(e.target.value)}
            />
            <TextField
              label="PSP-Element"
              variant="standard"
              value={projectPsp}
              onChange={(e) => projectPspChanged(e.target.value)}
            />
            <IconButton onClick={() => createProject()} disabled={!projectButtonEnabled}>
              <AddIcon />
            </IconButton>
          </CardContent>
        </Card>
        {projects
          .slice(0) //copy
          .reverse()
          .map((project) => (
            <ProjectCard onClicked={createTimer} project={project} />
          ))}
      </div>
      <h2 style={{ marginLeft: 8 }}>Timers</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Card sx={{ margin: 1, width: 316 }}>
          <CardContent>
            <TextField label="Name" variant="standard" value={newName} onChange={(e) => nameChanged(e.target.value)} />
            <IconButton onClick={() => createTimer()} disabled={!buttonEnabled}>
              <PlayArrowIcon />
            </IconButton>
          </CardContent>
        </Card>
        {timers.map((timer) => (
          <TimerCard key={timer.id} {...timer} onChange={onChange} onStop={onStop} />
        ))}
      </div>
      <RecordTable records={records} onDelete={deleteRecord} onArchive={archiveRecord} />
      <Report records={records}></Report>
    </>
  );
}

export default App;
