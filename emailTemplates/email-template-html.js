import { pullAll } from "lodash";

const getListsById = lists => {
  return lists.reduce((acc, l) => {
    acc[l.id_str] = l;
    return acc;
  }, {});
};

const listDetails = lists => {
  return lists.map((list, index) => {
    if (list.memberCount > 0) {
      return (
        <p key={index}>
          <a href={`https://twitter.com${list.uri}`}>{list.name}</a> {"-->"}{" "}
          {list.memberCount}
        </p>
      );
    }
    return (
      <p key={index}>
        <a href={list.uri}>{list.name}</a>
      </p>
    );
  });
};

const EmailTemplate = props => {
  const preLists = props.preLists;
  const totalAccountsOrganised = Object.values(props.lists).flat().length;
  const lists = props.lists;
  const memberLists = Object.keys(lists);
  const listsById = getListsById(preLists);
  const emptyLists = pullAll(Object.keys(listsById), memberLists).map(
    l => listsById[l]
  );
  let emptyListReport = null;
  const memberListReport = listDetails(
    memberLists.map(l => {
      return {
        ...listsById[l],
        memberCount: lists[l].length
      };
    })
  );
  if (emptyLists.length > 0) {
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
        Here's how we organised {` ${totalAccountsOrganised}`} accounts you
        follow.
      </p>
      {memberListReport}
      {/* {emptyListReport} */}
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
