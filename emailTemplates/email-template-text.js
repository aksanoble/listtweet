const listItems = lists => {
  return lists.reduce((acc, list) => {
    acc += `${list.name}(${list.url}) --> ${list.memberCount}`;
    acc += "\n  ";
    return acc;
  }, "");
};

const emailTemplateText = props => {
  return `
  Dear ${props.ownerName}
  Your Twitter Lists (https://twitter.com/${
    props.screenName
  }/lists) are now ready.
  Here's how we organised the ${
    props.followingCount
  } accounts you follow (https://twitter.com/${props.screenName}/following)
  
  ${listItems(props.lists)}

  Thank you for trying out ListTweet(https://listtweet.com) 
  Please reply to this email if you have any feedback. 
  
  If you'd like to support us you can buy us a tea! (${
    process.env.NEXT_PUBLIC_ADMIN_SPONSOR
  })
  Thank you
  ${process.env.NEXT_PUBLIC_ADMIN_NAME} from ListTweet `;
};

export default emailTemplateText;
