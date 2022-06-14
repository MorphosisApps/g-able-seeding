const path = require("path");
const fs = require("fs");

const { gql } = require("graphql-request");

const client = require("../client");

const file = path.join(__dirname, "../files/case_studies.json");

const data = fs.readFileSync(file, "utf-8");
const obj = JSON.parse(data);

const CREATE_CASE_STUDY = gql`
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
        type: CASE_STUDY
        short_description: $short
        is_recommend: false
        tag_topics: []
        tag_industries: []
        tag_solutions: []
        tag_types: [1]
        image: 1
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

const createCaseStudies = async () => {
  const posts = obj.posts;
  for (const post of posts) {
    const { title, description } = post;

    const slug = convertToSlug(title.substring(0, 20));

    const tags = post.category
      .filter((category) => category.domain === "portfolio_tag")
      .map((category) => category.title);
    let tag = tags.length > 0 ? tags.join(",") : "internet";
    var strippedHtml = description.replace(/<[^>]+>/g, "");

    let short = strippedHtml.substring(0, 100);

    console.log("TAG", tag);
    client
      .request(CREATE_CASE_STUDY, {
        title,
        description,
        tag,
        slug,
        short,
      })
      .then((data) => console.log("DATA", data))
      .catch((error) => console.error(error));
  }
};

createCaseStudies();
