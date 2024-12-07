import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
  Card,
  CardContent
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import Image from "next/image";

const features = [
  {
    title: "Simulate Multiple Attacks",
    description: "Test various attack types such as TCP Flood, UDP Flood, and HTTP Flood.",
  },
  {
    title: "Mitigate Attacks",
    description: "Apply real-time mitigation strategies to minimize the impact of ongoing attacks.",
  },
  {
    title: "Anomaly Detection with Machine Learning",
    description: "Monitor network traffic and detect potential threats.",
  },
  {
    title: "Interactive Dashboard",
    description:
      "A user-friendly interface to monitor activity and manage simulations and mitigation strategies.",
  },
];

const details = [
  {
    detail: "Host/URL",
    description: "Enter the URL or IP address of the website to be tested."
  },
  {
    detail: "Port",
    description: "Specify the port on which the website is running."
  },
  {
    detail: "Duration",
    description: "Set the duration of the attack in seconds."
  },
  {
    detail: "Host OS",
    description: "Specify the operating system of the target host."
  },
  {
    detail: "Host Endpoint (Optional)",
    description: "Specify the endpoint of the target host."
  },
  {
    detail: "Host Password (Optional)",
    description: "Enter the password for the target host."
  },
]

export default function Description() {
  return (
    <Container maxWidth="md">
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
        <Typography variant="body1" sx={{ textAlign: 'justify' }}>
          The <strong>DDoS Attack Simulation and Mitigation Platform</strong> is
          a web-based tool designed to help small to medium-sized businesses
          test their websites’ resilience against Distributed Denial of Service
          (DDoS) attacks. The platform provides a controlled environment to
          simulate real-world DDoS scenarios, identify vulnerabilities, and
          apply effective mitigation strategies without the need for a dedicated
          cybersecurity team.
          <br />
          <br />

          In this section, you will find a guide on how the platform works
          and instructions on how to use it. 
          We will explore key features, its intuitive interface,
          and the step-by-step process for setting up simulations, analyzing results,
          and implementing recommended mitigation techniques. Enjoy :)
        </Typography>

        {/* Key Features */}
        <Box id="features" sx={{ py: 5, backgroundColor: '#ffffff' }}>
          <Container>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{
                fontWeight: 'bold',
                mb: 4,
                position: 'relative',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50px',
                  height: '3px',
                  backgroundColor: '#000000', 
                },
              }}
            >
              Key Features
            </Typography>
            <Grid container spacing={4} align="center" justifyContent={"center"}>
            {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-5px)' },
                      width: 300, 
                      height: 150, 
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      mx: 'auto',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="h5" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1">{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>



 <Divider sx={{ my: 4, width: "100%" }} />

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
            <Typography>
              Click the <strong>Setup</strong> button to begin configuration.
            </Typography>
          </ListItem>
          <ListItem>Provide the following details:</ListItem>
          <ListItem>
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              {details.map((detail, index) => (
                <ListItem key={index}>
                  <Typography>
                    <strong>{detail.detail}:</strong> {detail.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </ListItem>
          <ListItem>
            <Typography>
              Click <strong>Done</strong> to save the configuration.
            </Typography>
          </ListItem>
        </List>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center" }}>
          <Box sx={{border: 1}}>
            <Image 
              src={"/Setup1.png"}
              width={400}
              height={400}
              alt="Setup"
            />
          </Box>
          <Box sx={{border: 1}}>
            <Image 
              src={"/Setup2.png"}
              width={400}
              height={400}
              alt="Setup"
            />
          </Box>
          
        </Box>

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
            <Typography>
              Click <strong>Start Attack</strong> to initiate the simulation. 
              A countdown will start to indicate the duration of the attack.
            </Typography>
          </ListItem>
          <ListItem>
            Monitor real-time logs and system performance during the attack.
          </ListItem>
        </List>

        <Box sx={{border: 1}} width={"50%"}>
          <Image 
            src={"/SimulateAttack.png"}
            width={400}
            height={400}
            alt="Setup"
          />
        </Box>

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
            <Typography>
              In the <strong>Simulation</strong> tab, click{" "}
              <strong>Defend Attack</strong> to activate the mitigation
              strategies. You can also stop the mitigation by clicking <strong>Stop Defending</strong>
            </Typography>
          </ListItem>
          <ListItem>
            Monitor logs and system metrics to verify the effectiveness of the
            mitigation.
          </ListItem>
          <ListItem>
            <strong>View instruction 3 image for reference.</strong>
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
            <Typography>
              Start and stop attack simulations from the{" "}
              <strong>Simulation Tab</strong>.
            </Typography>
          </ListItem>
          <ListItem>View detailed logs to assess system resilience.</ListItem>
          <ListItem>
          <Typography>
              <strong>Outgoing Traffic Logs:</strong> Latest 5 logs of outgoing traffic on the website.
          </Typography>
          </ListItem>
          <ListItem>
          <Typography>
              <strong>ML Status Logs:</strong> Current status of the Machine Learning model.
          </Typography>
          </ListItem>
          <ListItem>
          <Typography>
              <strong>Website Incoming Traffic Logs:</strong> Latest 5 logs of the incoming traffic on the victim website.
          </Typography>
          </ListItem>
        </List>

        <Box sx={{border: 1}}>
          <Image 
            src={"/Logs.png"}
            width={800}
            height={800}
            alt="Setup"
          />
        </Box>

      </Paper>
    </Container>
  );
}
