export const RATE_LIMITS = {
  "statuses/user_timeline": {
    get: 1500
  },
  "lists/members/create_all": {
    post: 65000
  }
};

export const DISTINCT_LIST = "listtweet-distinct";
