import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Project } from "./App";

export const ProjectCard = ({
  onClicked: createTimer,
  project,
}: {
  onClicked: (project: Project) => void;
  project: Project;
}) => {
  return (
    <Card
      onClick={() => createTimer(project)}
      sx={{ margin: 1, height: 150, width: 150, cursor: "pointer" }}
      key={project.psp}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {project.name}
        </Typography>
      </CardContent>
    </Card>
  );
};
