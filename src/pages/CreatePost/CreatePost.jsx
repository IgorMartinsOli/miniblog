import styles from './CreatePost.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from '../../hooks/useInsertDocuments';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState(null);
    const { user } = useAuthValue();

    const { insertDocument, response } = useInsertDocument("posts");

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
        
        insertDocument({
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName,
        });

        //redirect to home page
        navigate("/");
    }

    return (
        <div className={styles.create_post}>
            <h1>Criar Post</h1>
            <p>Escreva sobre o que quiser e compartilhe seu conhecimento</p>
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
                {!response.loading && <button className="btn">Criar post!</button>}
                {response.loading && (
                <button className="btn" disabled>
                    Aguarde.. .
                </button>
                )}
                {(response.error || formError) && (
                <p className="error">{response.error || formError}</p>
                )}
            </form>
        </div>
    )
}

export default CreatePost;
