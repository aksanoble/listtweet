const EmailTemplate = props => {
  return (
    <>
      <p>Dear {props.name}</p>
      <p>
        We did not find any valid{" "}
        <a href={`https://twitter.com/${props.screenName}/lists`}>lists</a> on
        your Twitter account. Please make sure that you have at least 2 lists
        with at least 1 member in each list.
      </p>
      <p>
        Thank you for trying out <a href="https://listtweet.com">ListTweet</a>
        . <br />
        Please reply to this email if you have any feedback. <br />
      </p>
      <p>
        If you'd like to support us,{" "}
        <a href={process.env.NEXT_PUBLIC_ADMIN_SPONSOR_LINK}>
          you can buy us a tea
        </a>
        .{" "}
      </p>
      Thank you <br />
      {process.env.NEXT_PUBLIC_ADMIN_NAME} from ListTweet
    </>
  );
};

export default EmailTemplate;
