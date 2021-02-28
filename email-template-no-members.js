const EmailTemplate = props => {
  return (
    <>
      <p>Dear {props.name}</p>
      <p>
        All the Lists on your Twitter account are empty. Please seed each of
        your lists with at least one account. This allows us to learn more about
        your Lists and classify the rest of the accounts you follow.
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
