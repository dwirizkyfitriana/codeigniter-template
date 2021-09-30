<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kopi extends MX_Controller {
function __construct() {
	parent::__construct();
}

	function index()
	{
		echo "string";
	}

function _get($order_by)  //get data order by
{$this->load->model('mdl_kopi'); $query = $this->mdl_kopi->get($order_by); return $query;}
function _get_limit($limit, $offset, $order_by) 
{$this->load->model('mdl_kopi'); $query = $this->mdl_kopi->get_with_limit($limit, $offset, $order_by); return $query;}
function _get_where($id) 
{$this->load->model('mdl_kopi'); $query = $this->mdl_kopi->get_where($id); return $query;}
function _get_where_custom($col, $value) 
{$this->load->model('mdl_kopi'); $query = $this->mdl_kopi->get_where_custom($col, $value); return $query;}
function _insert($data) 
{$this->load->model('mdl_kopi'); $this->mdl_kopi->_insert($data);}
function _update($id, $data) 
{$this->load->model('mdl_kopi'); $this->mdl_kopi->_update($id, $data);}
function _update_where($col, $value, $data)
{$this->load->model('mdl_kopi'); $this->mdl_kopi->_update_where($col, $value, $data);}
function _delete($id) 
{$this->load->model('mdl_kopi'); $this->mdl_kopi->_delete($id);}
function _count_where($column, $value) 
{$this->load->model('mdl_kopi'); $count = $this->mdl_kopi->count_where($column, $value); return $count;}
function _get_max() 
{$this->load->model('mdl_kopi'); $max_id = $this->mdl_kopi->get_max(); return $max_id;}
function _custom_query($mysql_query) 
{$this->load->model('mdl_kopi'); $query = $this->mdl_kopi->_custom_query($mysql_query); return $query;}

}
