import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetails(props) {
  const { image, title, description, address } = props.meetupData;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <MeetupDetail
        image={image}
        title={title}
        description={description}
        address={address}
      />
    </>
  );
}

//function get static paths is needed for dynamic routes

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://kibra:stinkingFingers101@cluster0.f3es2.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  //add second object to query to specify which fields in the data get retrieved
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    //fallback=false- array contains all possible id values
    //falback=true-tries to generate some data on the server
    fallback: "blocking",
    paths: meetups.map((meetup) => {
      return {
        params: {
          meetupId: meetup._id.toString(),
        },
      };
    }),
  };
}

export async function getStaticProps(context) {
  //get access to params
  //use identifier in dynamic routes
  const meetupId = context.params.meetupId;
  console.log({ context });

  const client = await MongoClient.connect(
    "mongodb+srv://kibra:stinkingFingers101@cluster0.f3es2.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  //add second object to query to specify which fields in the data get retrieved
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  client.close();
  console.log({ selectedMeetup });
  const { title, address, description, _id, image } = selectedMeetup;

  return {
    props: {
      meetupData: {
        title,
        address,
        image,
        description,
        id: _id.toString(),
      },
    },
  };
}
