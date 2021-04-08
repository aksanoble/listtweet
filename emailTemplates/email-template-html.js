import { pullAll } from "lodash";

const getListsById = lists => {
  return lists.reduce((acc, l) => {
    acc[l.id_str] = l;
    return acc;
  }, {});
};

const listDetails = lists => {
  return Object.keys(lists).map((listId, index) => {
    const list = lists[listId];
    console.log(list, "listdetails");
    if (list.nodes.length > 0) {
      return (
        <p key={index}>
          <a href={`https://twitter.com/i/lists/${listId}`}>{list.listName}</a>{" "}
          {"-->"} {list.nodes.length}
        </p>
      );
    }
  });
};

const EmailTemplate = props => {
  const totalAccountsOrganised = Object.values(props.lists)
    .map(l => l.nodes)
    .flat().length;
  const lists = props.lists;
  const listsById = Object.keys(lists);
  let emptyListReport = null;
  const memberListReport = listDetails(lists);
  // if (emptyLists.length > 0) {
  //   emptyListReport = (
  //     <>
  //       <p>
  //         The following lists did not have any account in them and were ignored.
  //       </p>
  //       {listDetails(emptyLists)}
  //     </>
  //   );
  // }

  return (
    <>
      <p>Dear {props.person.name}</p>
      <p>
        Your{" "}
        <a href={`https://listtweet.com/network`}> Twitter Visualization </a>
        <a href={`https://twitter.com/${props.person.screenName}/lists`}>
          and Lists
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
