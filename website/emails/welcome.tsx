import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FINDXWelcomeEmailProps {
  userFirstname: string;
}

export const FINDXWelcomeEmail = ({
  userFirstname,
}: FINDXWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to FIND-X, ready-made answer engine for your website.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://www.find-x.tech/logo.png`}
          width="50"
          height="50"
          alt="FIND-X"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Welcome to FIND-X! We're excited to have you on board.
        </Text>
        <Text style={paragraph}>
          To get started, click the button below and dive into your FIND-X
          experience:
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://www.find-x.tech/dashboard/indexing"
          >
            Get Started
          </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions or need assistance, feel free to reach out
          to us.
        </Text>
        <Text style={paragraph}>
          Best regards,
          <br />
          The FIND-X Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Ichalkaranji, Maharashtra, India.</Text>
      </Container>
    </Body>
  </Html>
);

FINDXWelcomeEmail.PreviewProps = {
  userFirstname: "Alan",
} as FINDXWelcomeEmailProps;

export default FINDXWelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#065f46",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
