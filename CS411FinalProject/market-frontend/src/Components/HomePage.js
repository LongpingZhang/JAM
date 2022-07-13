import './HomePage.scss';
import {useHistory} from "react-router-dom";

function HomePage({mode, setMode, isLogin, setIsLogin}) {
    let history = useHistory();
    const redirect = (nextMode) => {
        if (nextMode === 1) {
            if (isLogin && mode === 1) {
                history.push('/customer/');
            }
            else {
                history.push('/login/');
            }
        }
        else if (nextMode === 2) {
            if (isLogin && mode === 2) {
                history.push('/manager/');
            }
            else {
                history.push('/login/');
            }
        }
    }

	return (
		<div>
			<header>
                <div className="home_page">
                    <h1>Welcome!</h1>
                    <h2>You Are a ?</h2>
                    <div className="home_page_type_selection_section">
                        <div className="home_page_type_selection_card" onClick={() => {redirect(1);}}>Customer</div>
                        <div className="home_page_type_selection_card"  onClick={() => {redirect(2);}}>Manager</div>
                    </div>
                </div>
			</header>
		</div>
  	);
}

export default HomePage;