<template>
  <div class="hello">
    <!-- Disable until post message received -->
    <button style="margin-top: 20px;width: 100%;" id="btn" class="btn" data-tab-opener="yea" v-on:click="openNewTab">
      Open New
    </button>
    <!-- enable if any tab is open -->

    <div v-if="openedTabs.length" style="margin-top:20px;" id="btn-group">
      <button class="btn btn--success" style="width:15%;" v-on:click="broadCastAll">Send Msg</button>
      <button class="btn btn--danger" style="width:15%;float:right;" v-on:click="closeAllTabs">Close all</button>
    </div>

    <!-- <div>All tabs Info Below</div> -->
    <div style="display:inline-block;width:48%;">
      <div v-if="allTabs.length">
        <h3 class="margin--top">List of All Tabs:</h3>
        <div v-for="(tab, index) in allTabs" class="list-item" :key="index">
          <div>
            <div>
              <span>name:</span>
              <strong class="text--info"> {{ tab.windowName }} </strong>
            </div>
            <div>
              <span class="text--info">id: {{ tab.id }}</span>
            </div>
            <div>
              <span class="text--info">status: {{ tab.status }}</span>
            </div>
          </div>
          <br/>
        </div>

        <h3 class="margin--top">List of All Active Tabs:</h3>
        <div v-for="tab in openedTabs" class="list-item" :key="tab.id">
          <div>
            <div>
              <span>name:</span>
              <strong class="text--info"> {{ tab.windowName }}</strong>
            </div>
            <div>
              <span class="text--info">id: {{ tab.id }}</span>
            </div>
            <div>
              <span class="text--info">status: {{ tab.status }}</span>
            </div>
            <button class="btn btn--success" v-on:click="broadCastTo(tab.id, 'Yo! Message from parent!')">
              Send Msg
            </button>
            <button class="btn btn--danger margin--half-left" v-on:click="closeTab(tab.id)">
              Close me
            </button>
          </div>
          <br/>
        </div>

        <h3 class="margin--top">List of All Closed Tabs:</h3>
        <div v-for="tab in closedTabs" class="list-item" :key="tab.id">
          <div>
            <div>
              <span>name:</span>
              <strong class="text--info"> {{ tab.windowName }} </strong>
            </div>
            <div>
              <span>id: {{ tab.id }}</span>
            </div>
            <div>
              <span>status: {{ tab.status }}</span>
            </div>
          </div>
          <br/>
        </div>
      </div>
    </div>

    <div
        id="pm-section"
        style="margin-top:60px;width:48%; float:right;background: #efefef;padding: 20px;"
        v-if="allTabs.length"
    >
      <h3>All Post Messages Info Below</h3>
      <div v-for="(pm, index) in postMessageEvents" :key="index">
          <span v-if="pm.type === 'custom'">
            Tab: <strong>{{ pm.id }}</strong> sent:
            <span>{{ pm.msg }}</span>
          </span>
          <span v-if="pm.type === 'open'"> Tab: <strong>{{ pm.id }}</strong>
           Opened </span>
          <span v-if="pm.type === 'close'"> Tab: <strong>{{ pm.id }}</strong>
           Closed </span>
      </div>
    </div>
  </div>
</template>

<script>
  import AcrossTabs from 'across-tabs'

  export default {
  data: function() {
return {
    postMessageEvents: [],
    allTabs: [],
    openedTabs: [],
    closedTabs: [],
    i: 0,
    parent: new AcrossTabs.Parent({
        onHandshakeCallback: this.onHandshakeCallback,
        onChildCommunication: this.onChildCommunication,
        onPollingCallback: this.showList,
        onChildDisconnect: this.onChildDisconnect
      }
    ),
  };
},

  // Anything within the ready function will run when the application loads
  ready: function() {},

  // Methods we want to use in our application are registered here
  methods: {
    openNewTab: function() {
      let url = 'http://localhost:8080/#/child';
      try {
        // eslint-disable-next-line no-undef
        url = chrome.extension.getURL('index.html#/child');
      } catch (e) {
        // eslint-disable-next-line no-console
          console.log("Used url: " + url)
      }


      var config = {
        url: url,
        // eslint-disable-next-line no-undef
        windowName: 'Child - ' + ++this.i,
        windowFeatures: ''
      };
      this.parent.openNewTab(config);
    },
    closeAllTabs: function() {
      this.parent.closeAllTabs();
      this.showList();
    },
    closeTab: function(id) {
      this.parent.closeTab(id);
      this.showList();
    },
    broadCastTo: function(tab) {
      this.parent.broadCastTo(tab, 'Yo! Message from parent!!');
    },
    broadCastAll: function() {
      this.parent.broadCastAll('Yo! Broadcasted Message from parent to ALL!');
    },
    onHandshakeCallback: function(data) {
      data.type = 'open';
      // eslint-disable-next-line no-console
      console.log('onHandshakeCallback');
      this.showPMList(data);
    },
    onChildCommunication: function(data) {
      data.type = 'custom';
      this.showPMList(data);
    },
    onChildDisconnect: function(data) {
      data.type = 'close';
      this.showPMList(data);
    },
    showPMList: function(data) {
      this.postMessageEvents.push(data);
    },
    showList: function() {
      // if (!newTab) { return; }

      (this.allTabs = this.parent.getAllTabs()),
        (this.openedTabs = this.parent.getOpenedTabs()),
        (this.closedTabs = this.parent.getClosedTabs());
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
