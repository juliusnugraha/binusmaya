/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 var taskListArray = new Array();
 
$( document ).ready(function(){
    alert('ready lho');
    var $newTaskInput = $('#newTaskInput');
    var $taskList = $('#taskList');
    var taskTouchStart;
    var taskTouchEnd;
    var taskTouchStartX;
    var taskTouchEndX;

    if(window.localStorage)
    {
        taskListArray = JSON.parse(window.localStorage.getItem('taskList'));
    }

    // load saved task list from local storage
    if(taskListArray != null)
    {
        for (var i = 0; i < taskListArray.length; i++)
        {
            var newTask = '<li data-key="' + taskListArray[i].key + '"><span>' + taskListArray[i].task + '</span></li>';
            $taskList.append(newTask);

            var $newTask = $(newTask);
            if(taskListArray[i].done == true)
            {
                $newTask.addClass ('done');
            }
        };
    }
    else
    {
        taskListArray = new Array();
    }

    // button add new task
    $('#addNewTask').on('click', function(){
        var key = Date.now();
        var newTask = '<li data-key="' + key + '"><span>' + $newTaskInput.val() + '</span></li>';
        $taskList.append( newTask );
        // push new list to array and save to localstorage
        taskListArray.push({key:key, task:$newTaskInput.val(), done:false});
        if(window.localStorage)
        {
            window.localStorage.setItem('taskList', JSON.stringify(taskListArray));
        }

        $newTaskInput.val('');
    });

    // task list
    $taskList.on('touchstart', 'li', function(e){
        var start = document.elementFromPoint(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
        taskTouchStart = $(start).attr('data-key');
        taskTouchStartX = e.originalEvent.touches[0].pageX;
    });

    $taskList.on('touchend', 'li', function(e){
        var $this = $(this);
        var $end;
        var end = document.elementFromPoint(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
        $end = $(end);
        taskTouchEnd = $end.attr('data-key');
        taskTouchEndX = e.originalEvent.touches[0].pageX;

        // detect swipe
        if(taskTouchStart == taskTouchEnd)
        {
            if(taskTouchStartX < taskTouchEndX)
            {
                // flag done
                if($this.hasClass('done'))
                {
                    $this.removeClass('done');
                }
                else
                {
                    $this.addClass('done');
                }

                taskListArray = $.map(taskListArray, function(e){
                    if(e.key == taskTouchEnd)
                    {
                        e.done = $this.hasClass('done');
                    }
                    return e;
                });
            }
            else
            {
                // delete task list
                taskListArray = $.grep(taskListArray, function(e){
                    return e.key != taskTouchEnd;
                });

                $this.remove();
            }

            if(window.localStorage)
            {
                window.localStorage.setItem('taskList', JSON.stringify(taskListArray));
            }
        }
    });
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
