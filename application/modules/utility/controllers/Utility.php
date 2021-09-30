<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Utility extends MX_Controller {
function __construct() {
	parent::__construct();
}

function _notif_user($flash_msg, $alert){
	$value = '<div class="alert alert-'.$alert.' alert-dismissible fade show" role="alert" id="notif" 
				style="position:absolute; right:20px; top:50px; z-index:99">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">×</span>
				</button>
				   '.$flash_msg.'.
			</div>';
	$this->session->set_flashdata('item', $value);
} 

}
