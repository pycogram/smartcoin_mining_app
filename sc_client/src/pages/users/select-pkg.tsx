import "../../css/page_css/user_css/select-pkg.css";
import fireF from "../../images/pics/fire-frame.png";
import treeF from "../../images/pics/tree-frame.png";
import diamondF from "../../images/pics/diamond-frame.png";

const SelectPkg = () => {
    return ( 
        <div className="page-box">
            <div className="select-pkg">
                <span className="ref-span-go-back">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </span>
                <h3>active lock</h3>
                <div className="active-lock">
                    <p>total locked: $SC 6,000</p>
                    <p>time unlock: 27th April, 2025 - 11:00</p>
                </div>
                <h3>select package</h3>
                <div className="select-lock-pkg">
                    <div className="each-pkg">
                        <span>
                            <h4>fire</h4>
                            <img src={fireF} alt="fire package" />
                        </span>
                        <span>
                            <h2>10 days</h2>
                            <h3>40% returns</h3>
                        </span>
                    </div>
                    <div className="each-pkg">
                        <span>
                            <h4>tree</h4>
                            <img src={treeF} alt="tree package" />
                        </span>
                        <span>
                            <h2>10 days</h2>
                            <h3>40% returns</h3>
                        </span>
                    </div>
                    <div className="each-pkg">
                        <span>
                            <h4>diamond</h4>
                            <img src={diamondF} alt="diamond package" />
                        </span>
                        <span>
                            <h2>10 days</h2>
                            <h3>40% returns</h3>
                        </span>
                    </div>
                    <div className="each-pkg">
                        <span>
                            <h4>fire</h4>
                            <img src={fireF} alt="fire package" />
                        </span>
                        <span>
                            <h2>10 days</h2>
                            <h3>40% returns</h3>
                        </span>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default SelectPkg;