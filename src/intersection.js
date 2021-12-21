const commandLineArgs = require("command-line-args");
const Twitter = require("twitter");
const fs = require("fs");
const apiToken = require("./api-token.js");
const config = require("./config.js");

const client = new Twitter(apiToken.authorization);

const writeJSON = (name, data) => {
  const jsonStr = JSON.stringify(data, null, "  ");
  const options = {
    flag: "w",
  };
  fs.writeFile(config.dir + name, jsonStr, options, (fsError) => {
    if (!fsError) {
      console.log("succeeded writing: " + name);
    } else {
      console.log("failed to write.");
    }
  });
};

const getRemaining = () => {
  client.get("application/rate_limit_status", {}, (error, information) => {
    if (!error) {
      writeJSON("rate_limit_status.json", information);
    } else {
      console.log(error);
    }
  });
};

const getFollowings = (screenName, index, cursor) => {
  return new Promise((resolve, reject) => {
    const options = { screen_name: screenName, count: 200 };
    if (cursor != null) {
      options.cursor = cursor;
    }
    client.get("friends/list", options, (error, users, response) => {
      if (!error) {
        writeJSON(`${screenName}-${index}.json`, users);
        resolve(users.next_cursor_str);
      } else {
        console.log(error);
        reject();
      }
    });
  });
};

const getAllFollowings = async (screenName, cursor, index) => {
  index = index ?? 0;
  while (cursor === null || !["0", "-1"].includes(cursor)) {
    cursor = await getFollowings(screenName, index, cursor);
    index++;
    console.log(index, cursor);
  }
};

const intersect = (screenName0, screenName1) => {
  const readFromJSON = (screenName) => {
    let users = [];
    let index = 0;
    const filename = (index) => `${config.dir}${screenName}-${index}.json`;
    while (fs.existsSync(filename(index))) {
      const json = fs.readFileSync(filename(index));
      users = [...users, JSON.parse(json).users];
      index += 1;
    }
    return users.flat();
  };

  const users0 = readFromJSON(screenName0);
  const users1 = readFromJSON(screenName1);

  const intersection = users0.filter((user0) =>
    users1.some((user1) => user1.id == user0.id)
  );

  console.log(`${screenName0}: following ${users0.length} users`);
  console.log(`${screenName1}: following ${users1.length} users`);
  console.log(`intersection: ${intersection.length} users`);

  // output
  writeJSON(
    `intersection-${screenName0}_${screenName1}.json`,
    intersection.map((user) => user.name)
  );
};

const optionDefinitions = [
  {
    name: "following",
    alias: "f",
    type: Boolean,
  },
  {
    name: "remain",
    alias: "r",
    type: Boolean,
  },
  {
    name: "intersect",
    alias: "i",
    type: Boolean,
  },
  {
    name: "user0",
    alias: "u",
    type: String,
  },
  {
    name: "user1",
    alias: "v",
    type: String,
  },
];
const options = commandLineArgs(optionDefinitions);

if (options.folowing) {
  getRemaining();
}
if (options.users) {
  if (!options.u) {
    console.log("required: u");
    return;
  }
  getAllFollowings(options.user0);
}
if (options.intersect) {
  if (!options.u || !options.v) {
    console.log("required: u, v");
    return;
  }
  intersect(options.user0, options.user1);
}
