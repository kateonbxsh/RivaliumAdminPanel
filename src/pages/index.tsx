import dataProvider from "@/provider/RivaliumAPIProdiver";
import dynamic from "next/dynamic";
import {Admin, Resource} from "react-admin";

const AdminApp = dynamic(() => import('@/components/AdminPanel'), {
    ssr: false,
});


export default function IndexPage() {

    return <AdminApp />;

}