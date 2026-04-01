import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='footer-container'>
                <div className='footer-section'>
                    <h3>🚗 Achie Sells Cars</h3>
                    <p>Your trusted car dealer. Quality vehicles at the best prices.</p>
                </div>

                <div className='footer-section'>
                    <h3>Quick Links</h3>
                    <Link to='/'>Home</Link>
                    <Link to='/cars'>Browse Cars</Link>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </div>

                <div className='footer-section'>
                    <h3>Contact Us</h3>
                    <p>📞 +254 700 000 000</p>
                    <p>💬 WhatsApp: +254 700 000 000</p>
                    <p>📍 Nairobi, Kenya</p>
                </div>

                <div className='footer-section'>
                    <h3>Follow Us</h3>
                    <a href='https://tiktok.com' target='_blank' rel='noreferrer'>🎵 TikTok</a>
                    <a href='https://instagram.com' target='_blank' rel='noreferrer'>📸 Instagram</a>
                    <a href='https://facebook.com' target='_blank' rel='noreferrer'>👥 Facebook</a>
                </div>
            </div>

            <div className='footer-bottom'>
                <p>© 2026 Achie Sells Cars. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer