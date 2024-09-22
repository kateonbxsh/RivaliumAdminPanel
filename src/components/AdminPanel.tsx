import dataProvider from "@/provider/RivaliumAPIProdiver";
import authProvider from "@/provider/RivaliumAuthProvider";
import { Admin, ListGuesser, Resource } from "react-admin";
import { UserList } from "./users/Users";

export default function AdminPanel() {

    return <Admin dataProvider={dataProvider} authProvider={authProvider}> 
            <Resource name="user" list={UserList}/>
        </Admin>

}