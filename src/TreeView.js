/**
 * Created by think on 17/7/15.
 */
import React from "react";
import Tree from 'antd/lib/tree';
import 'antd/lib/tree/style/css';

const TreeNode = Tree.TreeNode;

const data = {
    name: "root",
    children: [{
        name: "a",
        value: "/a",
        children: [{
            name: "file_1",
            value: "/a/file_1"
        }, {
            name: "a_1",
            value: "/a/a_1",
            children: [{
                name: "file_2",
                value: "/a/a_1/file_2"
            }, {
                name: "file_3",
                value: "/a/a_1/file_3"
            }]
        }, {
            name: "a_2",
            value: "/a/a_2",
            children: [{
                name: "file_4",
                value: "/a/a_2/file_4"
            }, {
                name: "file_5",
                value: "/a/a_2/file_5"
            }]
        }]
    }, {
        name: "b",
        value: "/b",
        children: [{
            name: "b_1",
            value: "/b/b_1",
            children: [{
                name: "file_6",
                value: "/b/b_1/file_6"
            }]
        }]
    }]
}

class TreeView extends React.Component {
    state = {
        expandedKeys: ["/"],
        autoExpandParent: true,
        selectedKeys: []
    }

    //选中的回调
    onSelect = (selectedKeys, obj) => {
        // console.log("select ", selectedKeys, obj)

        let {expandedKeys} = this.state
        let selectedKey = this.state.selectedKeys

        // console.log("selectedKey", selectedKey)
        // console.log("expandedKeys", expandedKeys)

        //选中
        if (obj.selected) {
            let index = expandedKeys.indexOf(selectedKeys[0])
            // console.log("selected index", index)
            if (index === -1) {
                expandedKeys.push(selectedKeys[0])
                this.setState({
                    expandedKeys: expandedKeys,
                    selectedKeys: selectedKeys
                })
            } else {
                this.setState({
                    selectedKeys: selectedKeys
                })
            }

            // 没有children
            if (obj.event && obj.selectedNodes.length === 1 && !obj.selectedNodes[0].props.children) {
                //do something
            }

        } else {
            let index = expandedKeys.indexOf(selectedKey[0])

            // console.log("unselected index", index)
            if (index !== -1) {
                expandedKeys = expandedKeys.filter((ele) => {
                    return !ele.includes(selectedKey[0])
                })
                this.setState({
                    expandedKeys: expandedKeys,
                    selectedKeys: []
                })
            } else {
                this.setState({
                    selectedKeys: []
                })
            }
        }
    }

    //展开的回调
    onExpend = (expandedKey, obj) => {
        // console.log("expend ", expandedKey, obj)
        let {expandedKeys} = this.state

        // console.log("expandedKey", expandedKeys)

        //展开的状态
        if (obj.expanded) {
            this.setState({
                expandedKeys: expandedKey,
                selectedKeys: []
            })
        } else {
            //expandedKey 返回的是当前已经展开的元素 expandedKeys 是上次展开的元素
            //比较两个数组中缺少的元素得出当前被收起的是哪个元素
            let removeArray = this.diffArray(expandedKey, expandedKeys)
            //收起的时候需要把里面展开的元素一并移除，不然会造成收起动作无效
            expandedKeys = expandedKeys.filter((ele) => {
                return !ele.includes(removeArray[0])
            })
            this.setState({
                expandedKeys: expandedKeys,
                selectedKeys: []
            })
        }
    }

    //比较出2个数组中不一样的元素
    diffArray = (arr1, arr2) => {
        let arr3 = [];
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) === -1)
                arr3.push(arr1[i]);
        }
        for (let j = 0; j < arr2.length; j++) {
            if (arr1.indexOf(arr2[j]) === -1)
                arr3.push(arr2[j]);
        }

        // console.log("diff ", arr3)
        return arr3;
    }

    //遍历json绘制出tree结构
    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    return <TreeNode title={ele.name} key={ele.value}>
                        {this.mapData(ele.children)}
                    </TreeNode>
                } else {
                    return <TreeNode title={ele.name} key={ele.value}/>
                }
            })
        }
        return []
    }

    render() {
        let content = []

        let {name, children} = data
        if (name) {
            content.push(<TreeNode title={name} key="/">{this.mapData(children)}</TreeNode>)
        }

        // console.log("now ", this.state.expandedKeys)

        return (
            <Tree
                onExpand={this.onExpend}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}>
                {content}
            </Tree>
        );
    }
}

export default TreeView