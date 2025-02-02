import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FINDXLoginCodeEmailProps {
  magicLink: string;
  name: string;
  baseUrl: string;
}

export const FINDXLoginCodeEmail = ({
  magicLink,
  name,
  baseUrl,
}: FINDXLoginCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your login link for FIND-X</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="42"
          height="42"
          alt="FIND-X"
          style={logo}
        />
        <Heading style={heading}>Login to your FIND-X account</Heading>
        <Text style={paragraph}>
          Hi <span style={span}>{name} </span>, to access your FIND-X account,
          simply click the link below.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={magicLink}>
            Log in to FIND-X
          </Button>
        </Section>
        <Text style={paragraph}>
          Please note: The link will expire in 5 minutes. If it expires or
          doesn’t work, request a new one.
        </Text>
        <Hr style={hr} />
        <Text style={note}>
          This email was requested on {new Date().toUTCString()}. If you didn’t
          request this, feel free to ignore it.
        </Text>
        <Hr style={hr} />
        <Link href="https://www.find-x.tech" style={reportLink}>
          Visit FIND-X
        </Link>
      </Container>
    </Body>
  </Html>
);

FINDXLoginCodeEmail.PreviewProps = {
  magicLink: "https://find-x.ai",
} as FINDXLoginCodeEmailProps;

export default FINDXLoginCodeEmail;

const span = {
  color: "#065f46",
  fontWeight: "bold",
  fontSize: "15px",
};

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const note = {
  margin: "0 0 15px",
  fontSize: "13px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#065f46",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#3c4149",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};
