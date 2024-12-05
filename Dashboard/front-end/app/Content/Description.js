import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
} from "@mui/material";

export default function Description() {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4 }}>
        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          align="center"
        >
          DDoS Attack Simulation and Mitigation Platform
        </Typography>

        {/* Description */}
        <Typography variant="body1">
          The <strong>DDoS Attack Simulation and Mitigation Platform</strong> is
          a web-based tool designed to help small to medium-sized businesses
          test their websites’ resilience against Distributed Denial of Service
          (DDoS) attacks. The platform provides a controlled environment to
          simulate real-world DDoS scenarios, identify vulnerabilities, and
          apply effective mitigation strategies without the need for a dedicated
          cybersecurity team.
        </Typography>

        {/* Key Features */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Key Features
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}
          >
            <Typography variant="body1" fontWeight="bold">
              Simulate Multiple DDoS Attacks:
            </Typography>
            <Typography variant="body1">
              Test various attack types such as TCP Flood, UDP Flood, and HTTP
              Flood.
            </Typography>
          </ListItem>

          <ListItem
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}
          >
            <Typography variant="body1" fontWeight="bold">
              Mitigate Attacks:
            </Typography>
            <Typography variant="body1">
              Apply real-time mitigation strategies to minimize the impact of
              ongoing attacks.
            </Typography>
          </ListItem>

          <ListItem
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}
          >
            <Typography variant="body1" fontWeight="bold">
              Anomaly Detection with Machine Learning:
            </Typography>
            <Typography variant="body1">
              Monitor network traffic and detect potential threats.
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              Interactive Dashboard:
            </Typography>
            <Typography variant="body1">
              A user-friendly interface to monitor activity and manage
              simulations and mitigation strategies.
            </Typography>
          </ListItem>
        </List>

        <Divider sx={{ my: 4 }} />

        {/* How to Use the Platform */}
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          How to Use the Platform
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mt: 3 }}
        >
          1. Navigate to the Simulation Tab
        </Typography>
        <Typography variant="body1" sx={{ pl: 4 }}>
          Access the platform and navigate to the <strong>Simulation</strong>{" "}
          tab, where you can configure and initiate DDoS attack simulations.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mt: 3 }}
        >
          2. Set Up Configuration Parameters
        </Typography>
        <List sx={{ listStyleType: "decimal", pl: 4 }}>
          <ListItem>
            Click the <strong>Setup</strong> button to begin configuration.
          </ListItem>
          <ListItem>Provide the following details:</ListItem>
          <ListItem>
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              <ListItem>
                <strong>Host/URL:</strong> Enter the URL or IP address of the
                website to be tested.
              </ListItem>
              <ListItem>
                <strong>Port:</strong> Specify the port on which the website is
                running.
              </ListItem>
              <ListItem>
                <strong>Duration:</strong> Set the duration of the attack in
                seconds.
              </ListItem>
            </List>
          </ListItem>
          <ListItem>
            Click <strong>Submit</strong> to save the configuration.
          </ListItem>
        </List>

        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mt: 3 }}
        >
          3. Simulate a DDoS Attack
        </Typography>
        <List sx={{ listStyleType: "decimal", pl: 4 }}>
          <ListItem>
            Select the type of attack: TCP Flood, UDP Flood, or HTTP Flood.
          </ListItem>
          <ListItem>
            Click <strong>Start Attack</strong> to initiate the simulation.
          </ListItem>
          <ListItem>
            Monitor real-time logs and system performance during the attack.
          </ListItem>
        </List>

        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mt: 3 }}
        >
          4. Mitigate DDoS Attacks
        </Typography>
        <List sx={{ listStyleType: "decimal", pl: 4 }}>
          <ListItem>
            In the <strong>Simulation</strong> tab, click{" "}
            <strong>Defend Attack</strong> to activate the mitigation
            strategies.
          </ListItem>
          <ListItem>
            Monitor logs and system metrics to verify the effectiveness of the
            mitigation.
          </ListItem>
        </List>

        <Typography
          variant="h6"
          component="h3"
          fontWeight="bold"
          sx={{ mt: 3 }}
        >
          5. Monitor and Control with the Dashboard
        </Typography>
        <List sx={{ listStyleType: "disc", pl: 4 }}>
          <ListItem>
            Monitor real-time visualizations of network traffic and system
            performance.
          </ListItem>
          <ListItem>
            Start and stop attack simulations from the{" "}
            <strong>Simulation Tab</strong>.
          </ListItem>
          <ListItem>View detailed logs to assess system resilience.</ListItem>
        </List>
      </Paper>
    </Container>
  );
}
