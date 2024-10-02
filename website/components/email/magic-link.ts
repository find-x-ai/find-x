export const magicLinkLogin = async ({
  email,
  link,
  name,
}: {
  email: string;
  link: string;
  name: string;
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Magic Link Login</title>
      <style>
        body {
            height: 600px;
            display: flex;
            justify-content: start;
            align-items: center;
        }
        .content {
          max-width: 400px;
          padding: 25px;
          font-family: Sans-serif;
        }
        .content > * {
            margin: 50px 0px;
        }
        .project {
          font-size: 30px;
        }
        .header {
          font-size: 20px;
        }
        .greeting {
          font-size: 20px;
        }
        .footer {
          font-size: 12px;
          line-height: 20px;
        }
        .danger {
            color: red;
        }

        .link {
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 25px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
        }
        .link:visited {
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h2 class="project">Find-X</h2>
        <h1 class="header">Magic Link Login</h1>
        <p class="greeting">Hello ${name},</p>
        <p>Click the link below to log in:</p>
        <a href="${link}" class="link">Log In</a>
        <p>If the link doesn't work, please copy and paste the following URL into your browser:</p>
        <a href="${link}" style="font-size: 16px; color: gray;">${link}</a>
        <p class="footer"><b>Didn't request this?</b><br/>If you did not make this request, you can safely ignore this email.</p>
        <p class="danger"><b>DO NOT SHARE THIS LINK WITH ANYONE!</b></p>
      </div>
    </body>
    </html>
    `;
};
