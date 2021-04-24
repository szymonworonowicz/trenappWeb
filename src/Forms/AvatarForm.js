import {useState,useContext} from 'react'
import {LanguageContext} from '../languages/LanguageContext'
import Avatar from 'react-avatar-edit'
import {Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import axios from 'axios'
import jwt_decode from 'jwt-decode';



const useStyle = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(1, 0, 2),
        backgroundColor: 'firebrick'
        
      },
}))

function AvatarForm(props){
//Funkcyjny
    const {image, closeModalFn} = props
    const [localImage,setLocalImage] = useState(image)
    const context = useContext(LanguageContext)
      
    const onCrop = (preview) =>  {
        setLocalImage(preview)
      }

    const onClick =() => {
        closeModalFn(localImage)

        const token = localStorage.getItem('token')
        if(token === null || token === undefined) {
            return
        }
        const decode = jwt_decode(token)
        const {id} = decode
        const body = {
            userId:id,
            image: localImage
        }
        const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          
        axios.post('api/auth/addphoto',body,config)
        .then(response => {
            console.log(response)
            window.location.reload(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const classes = useStyle()
    return (
        <div>
            <Avatar
                width='auto'
                height={295}
                onCrop={onCrop}
                src={localImage}
            />
            <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.submit}
                      onClick={(e) => onClick()}
                    >
                        {context.dictionary.Save}
            </Button>
        </div>
    )
}

export default AvatarForm