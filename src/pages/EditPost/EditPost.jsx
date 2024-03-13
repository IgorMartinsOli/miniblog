import styles from './EditPost.module.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';

const EditPost = () => {
    const { id } = useParams();
    const { document: post } = useFetchDocument("posts", id);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if(post){
            setTitle(post.title);
            setImage(post.image);
            setBody(post.body);
            const textTags = post.tagsArray.join(", ");
            setTags(textTags);
        }
    
    }, [post]);

    const { user } = useAuthValue();

    const { updateDocument, response } = useUpdateDocument("posts");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        //validate url image
        try {
            new URL(image)
        } catch (error) {
            setFormError("Insira uma URL válida para a imagem");
            return;
        }

        //create the tag array
        const tagsString = tags.join(",");
        const tagsArray = tagsString.split(",").map((tag) => tag.trim().toLowerCase());

        //check all values
        if(!title || !image || !body || !tagsArray) {
            setFormError("Preencha todos os campos!");
        }

        if(formError) return;

        const data = {
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName,
        }
        
        updateDocument(id, data);

        //redirect to home page
        navigate("/dashboard");
    }

    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h1>Editar post: {post.title}</h1>
                    <p>Altere os dados do post como quiser</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Título</span>
                            <input
                                type='text'
                                name='title'
                                required placeholder='Compartilhe com seus amigos...'
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </label>
                        <label>
                            <span>URL da imagem</span>
                            <input
                                type='text'
                                name='image'
                                placeholder='Insira a URL da imagem'
                                required
                                onChange={(e) => setImage(e.target.value)}
                                value={image}
                            />
                        </label>
                        <p className={styles.preview_title}>Preview da imagem atual:</p>
                        <img src={post.image} className={styles.image_preview} alt={post.title}/>
                        <label>
                            <span>Conteúdo</span>
                            <textarea
                                name='body'
                                required
                                placeholder='Escreva o que quiser...'
                                onChange={(e) => setBody(e.target.value)}
                                value={body}
                            />
                        </label>
                        <label>
                            <span>Tags</span>
                            <input
                                type='text'
                                name='tags'
                                required
                                placeholder='Insira tags separadas por vírgula'
                                onChange={(e) => setTags(e.target.value.split(","))}
                                value={tags}
                            />
                        </label>
                        {!response.loading && <button className="btn">Editar</button>}
                        {response.loading && (
                        <button className="btn" disabled>
                            Aguarde.. .
                        </button>
                        )}
                        {(response.error || formError) && (
                        <p className="error">{response.error || formError}</p>
                        )}
                    </form>
                </>
            )}
        </div>
    )
}

export default EditPost;
