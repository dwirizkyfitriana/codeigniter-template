<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
use Restserver\Libraries\REST_Controller;

class Users extends REST_Controller {
function __construct() {
	parent::__construct();
}

	function index_get()
	{
		$id = $this->input->get('id');
		if ($id == '') {
			$query = $this->_get('id')->result();
		} else {
			$query = $this->_get_where($id)->result();
		}
		if ($query) {
			$this->response(array('error' => false, 'data' => $query, 'status' => 'success', 'code' => 200), 200);
		} else {
			$this->response(array('error' => false, 'status' => 'User not found', 'code' => 404), 404);
		}
	}

	function index_post() {
		$data['name'] = $this->post('name');
		$data['address'] = $this->post('address');

		$this->_insert($data);
		$data['id'] = $this->db->insert_id();
		$this->response(array('error' => false, 'data' => $data, 'status' => 'success', 'code' => 200), 200);
	}

	function index_put() {
		$id = $this->put('id', true);
		$data['name'] = $this->put('name');
		$data['address'] = $this->put('address');

		$this->_update($id, $data);
		$data['id'] = $id;
		$this->response(array('error' => false, 'data' => $data, 'status' => 'success', 'code' => 200), 200);
	}

	function index_delete() {
		$id = $this->delete('id', true);
		$this->_delete($id);
		$data['id'] = $id;
		$this->response(array('error' => false, 'data' => $data, 'status' => 'success', 'code' => 200), 200);
	}

function _get($order_by)  //get data order by
{$this->load->model('mdl_users'); $query = $this->mdl_users->get($order_by); return $query;}
function _get_limit($limit, $offset, $order_by) 
{$this->load->model('mdl_users'); $query = $this->mdl_users->get_with_limit($limit, $offset, $order_by); return $query;}
function _get_where($id) 
{$this->load->model('mdl_users'); $query = $this->mdl_users->get_where($id); return $query;}
function _get_where_custom($col, $value) 
{$this->load->model('mdl_users'); $query = $this->mdl_users->get_where_custom($col, $value); return $query;}
function _insert($data) 
{$this->load->model('mdl_users'); $insert = $this->mdl_users->_insert($data);}
function _update($id, $data) 
{$this->load->model('mdl_users'); $update = $this->mdl_users->_update($id, $data);}
function _update_where($col, $value, $data)
{$this->load->model('mdl_users'); $this->mdl_users->_update_where($col, $value, $data);}
function _delete($id) 
{$this->load->model('mdl_users'); $this->mdl_users->_delete($id);}
function _count_where($column, $value) 
{$this->load->model('mdl_users'); $count = $this->mdl_users->count_where($column, $value); return $count;}
function _get_max() 
{$this->load->model('mdl_users'); $max_id = $this->mdl_users->get_max(); return $max_id;}
function _custom_query($mysql_query) 
{$this->load->model('mdl_users'); $query = $this->mdl_users->_custom_query($mysql_query); return $query;}

}
