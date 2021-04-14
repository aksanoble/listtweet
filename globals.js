export const RATE_LIMITS = {
  "statuses/user_timeline": {
    get: 1500
  },
  "lists/members/create_all": {
    post: 600
  },
  "lists/create": {
    post: 65000
  }
};

export const COLORS = [
  "#550527",
  "#688e26",
  "#faa613",
  "#f44708",
  "#a10702",
  "#d0e1d4",
  "#e5446d",
  "#f2f4f3",
  "#a3d9ff",
  "#7e6b8f"
];

export const DISTINCT_LIST = "listtweet-distinct";

export const LT_STATUS = {
  progress: "progress",
  completed: "completed",
  invalid: "invalid"
};

export const MAX_FRIENDS_COUNT = 2000;

export const CACHE_DAYS = 30;
