import React from 'react';
import './AboutHis.css';
import Navbar from '../Navbar';

function AboutHis () {
return <div>
<Navbar/>
	<section className="About">

		<div className="text">About Us HISTORY</div>

		<div className='button'>

            <a href='INTRODUCTION'><button type="button" class="INTRODUCTION">INTRODUCTION</button></a>
			<a href='HISTORY'><button type="button" class="HISTORY">HISTORY</button></a>
			<a href='INVESTORRELATIONS'><button type="button" class="INVESTORRELATIONS">INVESTOR RELATIONS</button></a>
		</div>
	

		<div className='card-body'>
			<div class="card-body_1">
					<h4 className="card-title">Chart and HTML</h4>
					<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
			</div>

			<div class="card-body_2">
					<h4 className="card-title">Chart and HTML</h4>
					<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's asdadfasagdfbvbsasfascc zxfasdzcasfacvxzvasfasdascacsdvsdgbder content.</p>
			</div>
		</div>
	 
    
	</section>
	
</div>
}
export default AboutHis;
