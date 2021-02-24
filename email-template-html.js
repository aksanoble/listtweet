const EmailTemplate = props => {
  const listItems = props.lists.map(list => (
    <p>
      <a href={list.url}>{list.name}</a> {"-->"} {list.memberCount}
    </p>
  ));
  return (
    <>
      <p>Dear {props.ownerName}</p>
      <p>
        Your{" "}
        <a href={`https://twitter.com/${props.screenName}/lists`}>
          Twitter Lists
        </a>{" "}
        are now ready.
      </p>
      <p>
        Here's how we organised the{" "}
        <a href={`https://twitter.com/${props.screenName}/following`}>
          {props.followingCount} accounts you follow
        </a>
        .
      </p>
      {listItems}
      <p>
        Thank you for trying out <a href="https://listtweet.com">ListTweet</a>.{" "}
        <br />
        Please reply to this email if you have any feedback. <br />
      </p>
      <p>
        If you'd like to support us,{" "}
        <a href="process.env.NEXT_PUBLIC_ADMIN_SPONSOR">you can buy us a tea</a>
        .{" "}
      </p>
      Thank you <br />
      {process.env.NEXT_PUBLIC_ADMIN_NAME} from ListTweet
    </>
  );
};

export default EmailTemplate;
