const EmailTemplate = props => {
  return (
    <>
      <p>Dear {props.name}</p>
      <p>
        We only found one List in your Twitter account. We need at least 2 lists
        to organise the accounts you follow. <br />
        Please initialise more lists and try again.
      </p>
      <p>
        Thank you for trying out <a href="https://listtweet.com">ListTweet</a>
        . <br />
        Please reply to this email if you have any feedback. <br />
      </p>
      <p>
        If you'd like to support me,{" "}
        <a href={process.env.NEXT_PUBLIC_ADMIN_SPONSOR_LINK}>
          you can buy me a tea
        </a>
        .{" "}
      </p>
      Thank you <br />
      {process.env.NEXT_PUBLIC_ADMIN_NAME} from ListTweet
    </>
  );
};

export default EmailTemplate;
