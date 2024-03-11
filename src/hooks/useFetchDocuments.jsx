import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelled, setCancelled] = useState(false);


    useEffect(() => {
        const fetchDocuments = async () => {
            if (cancelled) return;
            setLoading(true);
            const collectionRef = collection(db, docCollection);
            try {
                let q

                if (search) {
                    q = query(collectionRef, where("tagsArray", "array-contains", search), orderBy("createdAt", "desc"));
                }else {
                    q = query(collectionRef, orderBy("createdAt", "desc"));
                }
                onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                    )
                });
                setLoading(false);
                
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [docCollection, search, uid, cancelled]);

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { documents, loading, error };
}