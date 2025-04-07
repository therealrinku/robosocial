import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { FiImage } from "react-icons/fi";
import { useState } from "react";
import { connect } from "react-redux";
import * as postsActions from "../../redux/post/postsActions";
import Modal from "../Modal";

type PostUploadModalTypes = {
  UPLOAD_POST: any;
  toggle: any;
  currentUserUid: any;
  currentUsername: any;
  currentUserProfileImage: any;
};

const PostUploadModal = ({
  UPLOAD_POST,
  toggle,
  currentUserUid,
  currentUsername,
  currentUserProfileImage,
}: PostUploadModalTypes) => {
  const [files, setFiles] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs = files.map((file: any) => (
    <div key={file.name}>
      <div>
        <img src={file.preview} className="w-full" />
      </div>
    </div>
  ));

  const uploadPost = () => {
    if (files) {
      if (["jpg", "png", "jpeg"].includes(files[0].name.slice(files[0].name.lastIndexOf(".") + 1))) {
        toggle();
        UPLOAD_POST({
          owner_uid: currentUserUid,
          status: status,
          currentUsername: currentUsername,
          image: files[0],
          posted_date: new Date(),
          currentUserProfileImage: currentUserProfileImage,
        });
      } else {
        alert("Image must be on jpg,png or jpeg format.");
      }
    }
  };

  return (
    <Modal title="Add Post" onClose={toggle}>
      <div className="text-sm flex flex-col items-center">
        {files.length < 1 && (
          <section {...getRootProps()} className="flex flex-col items-center gap-5">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <FiImage size={50} />
                <p>Drop your Image here</p>
                <button className="text-white px-5 py-1 bg-[#018e23]">Select from device</button>
              </>
            )}
          </section>
        )}

        {files.length > 0 && (
          <section className="flex flex-col gap-5 w-full">
            <span className="flex items-center justify-between">
              <input
                type="text"
                value={status}
                className="ml-1"
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status(optional)..."
              />
              <button className="text-[#018e23]" onClick={uploadPost}>
                Submit
              </button>
            </span>

            {thumbs}
          </section>
        )}
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUsername: state.user.currentUserData.username,
    currentUserUid: state.user.currentUserData.uid,
    currentUserProfileImage: state.user.currentUserData.profile_image_url,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    UPLOAD_POST: (post_data: any) => dispatch(postsActions.UPLOAD_POST(post_data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostUploadModal);
