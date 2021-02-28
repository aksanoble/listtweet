const listDetails = lists => {
  return lists.map((list, index) => {
    if (list.memberCount > 0) {
      return (
        <p key={index}>
          <a href={list.url}>{list.name}</a> {"-->"} {list.memberCount}
        </p>
      );
    }
    return (
      <p key={index}>
        <a href={list.url}>{list.name}</a>
      </p>
    );
  });
};

const EmailTemplate = props => {
  const lists = props.preLists;
  const emptyLists = lists.filter(list => list.members.length === 0);
  const memberLists = lists.filter(list => list.members.length > 0);
  let emptyListReport = null;
  const memberListReport = listDetails(memberLists);
  if (lists.length === 0) {
    return (
      <>
        <p>Dear {props.name}</p>
        <p>
          We did not find any lists on your Twitter account. Please create
          lists, seed each of them with an account and try again.{" "}
          <a href="https://help.twitter.com/en/using-twitter/twitter-lists">
            Here's how.{" "}
          </a>
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
  }
  if (emptyListReport > 0) {
    emptyListReport = (
      <>
        <p>
          The following lists did not have any account in them and were ignored.
        </p>
        {listDetails(emptyLists)}
      </>
    );
  }

  return (
    <>
      <p>Dear {props.name}</p>
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
      {memberListReport}
      {emptyListReport}
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
