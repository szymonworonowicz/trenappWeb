import './Styles/Footer.css'
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import { Icon} from '@iconify/react';
import spotifyIcon from '@iconify-icons/mdi/spotify';


function Footer ()  {
    return (
        <div className="footer" >
            <div className="phantomStyle" />
            <div className="footerStyle">
                <div className="footerContent">
                    <p className="footerContent__paragraph">Follow us</p>
                    <ul className="list">
                        <li className="list__element"><a href="https://www.facebook.com/podsztanga"><FacebookIcon /></a></li>
                        <li className="list__element"><a href="https://www.youtube.com/user/Jurand123"><YouTubeIcon/></a></li>
                        <li className="list__element"><a href="https://www.instagram.com/podsztanga.pl/"><InstagramIcon/></a></li>
                        <li className="list__element"><a href="https://open.spotify.com/show/2OkkyY7eODV29b2iW7lV0q?si=rHjvFxTFQfOPR6PbDXVQpg"><Icon icon={spotifyIcon} height="25px"/> </a> </li>
                    </ul>
                </div>
            </div>
        </div> 
    )
}

export default Footer;