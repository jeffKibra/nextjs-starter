import { MongoClient } from "mongodb";
import Head from "next/head";

import MeetupList from "../components/meetups/MeetupList";

export default function Home(props) {
  console.log({ props });
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of react meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
  //any code written here is executed during build process... will never reach client side
  //fetch data from an api
  //return an object with props
  const client = await MongoClient.connect(
    "mongodb+srv://kibra:stinkingFingers101@cluster0.f3es2.mongodb.net/meetupsDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();
  console.log({ meetups });

  return {
    props: {
      meetups: meetups.map((meetup) => {
        const { title, address, _id, image } = meetup;
        return {
          title,
          address,
          image,
          id: _id.toString(),
        };
      }),
    },
    //incremental data validation
    //secs ... before regenerating the page for an incoming request
    revalidate: 10,
  };
}

// export async function getServerSideProps(context){
//   const req=context.req
//   const res=context.res
//   //return object with props
//   //runs only on the server... never on the client

//   return {
//     props: {
//       meetups: DUMMY_DATA,
//     },
//   };
// }
