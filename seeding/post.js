const path = require("path");
const fs = require("fs");

const { gql } = require("graphql-request");

const client = require("../client");

const file = path.join(__dirname, "../files/post.json");

const data = fs.readFileSync(file, "utf-8");
const obj = JSON.parse(data);

const CREATE_POST = gql`
  mutation createInsight(
    $title: String
    $short: String
    $description: String
    $tag: String
    $slug: String
  ) {
    createInsight(
      data: {
        title: $title
        description: $description
        short_description: $short
        is_recommend: false
        tag_topics: []
        tag_industries: []
        tag_solutions: []
        tag_types: [2, 3, 4]
        image: 2
        tags: $tag
        slug: $slug
      }
    ) {
      data {
        id
      }
    }
  }
`;

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const createPost = async () => {
  const posts = obj.posts;
  console.log("POST", posts.length);
  for (const post of posts) {
    if (Object.prototype.hasOwnProperty.call(post, "title")) {
      const { title, description } = post;

      const slug = convertToSlug(title.substring(0, 20));

      const tags = post.category
        .filter((category) => category.domain === "post_tag")
        .map((category) => category.title);
      let tag = tags.length > 0 ? tags.join(",") : "internet";
      var strippedHtml = description ? description.replace(/<[^>]+>/g, "") : "";

      let short = strippedHtml.substring(0, 100);

      console.log("TAG", tag);
      client
        .request(CREATE_POST, {
          title,
          description,
          tag,
          slug,
          short,
        })
        .then((data) => console.log("DATA", data))
        .catch((error) => console.error(error));
    }
  }
};

createPost();
