$(document).ready(function(){
	var $form_add_task=$('.add_task');
	var $cont_detail_mask=$('.cont_detail_mask');
	var $cont_detail=$('.cont_detail');
	
	var $delete_task;
	var $detail_task;
	var $update_form;
	var $detail_task_content;
	var $checkbox_complete;

	var task_list=[];//创建任务列表数组
	var current_index;

	init();

	$form_add_task.on('submit',add_task_form_submit);	
	$cont_detail_mask.on('click',hide_task_detail);

	function add_task_form_submit(e){
		var new_task = {};
		e.preventDefault();//阻止默认事件行为的触发
		new_task.content=$('.input_text').val();//获取输入的新任务

		if(!new_task.content) return;
		/*将新的任务存入浏览器内存中*/
		if(add_task_list(new_task)){
			//console.log("task_list",task_list);
			//render_task_list();
			$('.input_text').val('');
		}
	}

	/*监控删除事件*/
	function listen_task_delete(){
		/*添加delet事件*/
		$delete_task.on('click',function(){
			//e.preventDefault();//阻止默认事件行为的触发
			var $this=$(this);
			var $item=$this.parent().parent();
			var index=$item.data('index');
			var isTrue=confirm('确认删除');
			isTrue? delete_task(index) : null;
			console.log('$item.data(index)',$item.data("index"));
		});
	}

	/*监听显示细节事件*/
	function listen_task_detail(){
		var index;

		$('.li_content').on('dblclick', function(){
			index=$(this).data('index');
			show_task_detail(index);
		});
		/*添加delet事件*/
		$detail_task.on('click',function(){
			//e.preventDefault();//阻止默认事件行为的触发
			var $this=$(this);
			var $item=$this.parent().parent();
			var index=$item.data('index');

			show_task_detail(index);
		});
	}

	function listen_checkbox_complete(){
		$checkbox_complete.on('click',function(){
			var $this=$(this);
			var is_complete=$this.is(':checked');
			var index=$this.parent().parent().data('index');
			//update_task(index, {complete:is_complete});
			var item=get(index);
			if(item.complete){
				update_task(index, {complete:false});
				//$this.attr('checked', true);	//attr()方法设置或返回被选元素的属性值
			} else{
				update_task(index, {complete:true});
				//$this.attr('checkes', false);
			}
		});
	}

	function get(index){
		return store.get('task_list')[index];
	}

	/*存入任务事件*/
	function add_task_list(new_task){
		task_list.push(new_task);
		
		refresh_task_list();
		return true;
	}

	/*删除task_list中的task*/
	function delete_task(index){
		if(index===undefined || !task_list[index]) return;
		delete task_list[index];
		refresh_task_list();
	}

	/*更新localstorage*/
	function refresh_task_list(){
		store.set("task_list",task_list);
		render_task_list();
	}

	/*从浏览器localstorage中获取task_list*/
	function init(){
		//store.clear();
		task_list=store.get("task_list") || [];
		if(task_list.length){
			render_task_list();
		}
	}


	/*设置单个任务显示*/
	function render_task_tpl(data, index){
		if(!data || !index) return;
 		var single_task_item='<li class="li_content" data-index="' + index + '">' +
					'<span><input class="complete" type="checkbox"' + (data.complete? 'checked':'') + '/></span>' +
					'<span class="data_content">' + data.content + '</span>' +
					'<span class="del_det">' +
					'<span class="action delete"> 删除</span>' +
					'<span class="action detail"> 细节</span>' +
					'</span>' +
					'</li>' ;

		return $(single_task_item);
	}

	/*将输入的任务显示在任务栏*/
	function render_task_list(){
		var $show_area=$('#show_area');
		$show_area.html('');
		var complete_items=[];

		for(var i=0;i<task_list.length;i++){
			var item=task_list[i];
			if(item && item.complete)
				complete_items[i]=item;
			else{
				var $single_task=render_task_tpl(task_list[i], i);
			}
			
			$show_area.prepend($single_task);
		}

		for(var j=0; j<complete_items.length; j++){
			$task=render_task_tpl(complete_items[j], j);
			if(!$task) continue;
			$task.addClass('completed');
			$show_area.append($task);
		}

		$delete_task=$('.action.delete');
		$detail_task=$('.action.detail');
		$checkbox_complete=$('.li_content .complete');

		listen_task_delete();	//每次添加一个删除监听事件
		listen_task_detail();	//每次添加一个细节监听事件
		listen_checkbox_complete();
	}

	/**显示细节功能区样式*/
	function show_task_detail(index){
		$cont_detail_mask.show();
		$cont_detail.show();
		render_task_detail(index);

		current_index=index;
	}

	/**隐藏细节功能区样式*/
	function hide_task_detail(){
		$cont_detail_mask.hide();
		$cont_detail.hide();
	}

	function render_task_detail(index){
		if(index === undefined || !task_list[index]) return;
		var item=task_list[index];


		var tpl = '<form class="form">' +
				'<div class="detail_content">' +	
				'<span>' + item.content + '</span>' +
				'</div>' + 
				'<div>' +
				'<input style="display:none;" type="text" name="content" value="' + item.content +'">' +
				'</div>' +
				'<div class="detail_desc">' +	
					'<textarea name="desc">' + (item.desc || '') + '</textarea>' +
				'</div>' +
				'<div class="detail_date">' +
					'<input class="datetime" type="date" name="remind_date" value="'+(item.remind_date || '') + '">' +  
				'</div>' +
				'<div><button type="submit">更新</button></div>' +
		 '</form>' ;

		 //$('.form .datetime').datetimepicker();
		 $cont_detail.html('');
		 $cont_detail.html(tpl);
		 $update_form=$cont_detail.find('form');
		 $detail_task_content=$update_form.find('.detail_content');

		 $detail_task_content.on('dblclick', function(){
		 	$('[name=content]').show();
		 	$('.detail_content').hide();
		 });

		 $update_form.on('submit', function(e){
		 	e.preventDefault();
		 	var data={};
		 	data.content=$(this).find('[name=content]').val();
		 	data.desc=$(this).find('[name=desc]').val();
		 	data.remind_date=$(this).find('[name=remind_date]').val();
		 	update_task(index, data);
		 	hide_task_detail();
		 });
	}

	function update_task(index, data){
		if(index === undefined || !task_list[index]) return;

		task_list[index] = $.extend({},task_list[index],data);
		refresh_task_list();
		console.log('task_list[index]',task_list[index]);
	}

})



