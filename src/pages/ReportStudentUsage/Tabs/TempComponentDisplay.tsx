import { Box, Button, Paper, Typography } from "@material-ui/core";
import React from "react";
import PercentCircle from "../../../components/Chart/PercentCircle";

export default function () {
  return (
    <div>
      <Paper>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Typography
            variant="h5"
            style={{
              width: "100%",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "left",
              marginBottom: 48,
            }}
          >
            Number of students <br /> created account
          </Typography>
          <PercentCircle
            width={370}
            height={370}
            total={9600}
            value={4000}
            fontSize={22}
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            percentAsLabel
          />
          <Typography
            style={{
              marginTop: 20,
              marginBottom: 100,
            }}
          >
            Out off 9000 Students
          </Typography>
          <Button fullWidth variant="contained" color="primary">
            View Full List
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
