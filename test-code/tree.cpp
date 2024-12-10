  #include <iostream>
  #include <queue>
  #include <stack>
  #include <limits>
  #define INT_MIN numeric_limits<int>::min()

  using namespace std;

  template <typename T> 
  class Node {
  public:
    Node<T>* left;
    Node<T>* right;
    T        data;

    T value;

    Node()
    {
      left = right = nullptr;
      data = 0;
    }

    Node(T d) : data(d), left(nullptr), right(nullptr) {}

    ~Node(){}

  };

  template <typename T> 
  class Tree {
  public:
    Node<T>* root;

    Tree()
    {
      root = nullptr;
    }

    Tree(T d)
    {
      root = new Node(d);
    }

    void _insert(Node<T>* &_root, T data){
      if (_root == nullptr)
      _root = new Node(data);
      else
      {
        if (data > _root->data)
          _insert(_root->right, data);
        else
          _insert(_root->left, data);
      }
    }

    Tree& operator << (T val)
    {
      _insert(root, val);
      return *this;
    }

    void inorder(Node<T> *n){
      if (n != nullptr)
      {
        inorder(n->left);
        std::cout<<n->data<<"-";
        inorder(n->right);
      }
    }


    void preorder(Node<T> *n){
      if (n != nullptr)
      {
        std::cout<<n->data<<'-';
        preorder(n->left);
        preorder(n->right);
      }
    }


    void postorder(Node<T> *n){
      if (n != nullptr)
      {
        postorder(n->left);
        postorder(n->right);
        std::cout<<n->data<<'-';
      }
    }

    void bfs (T item)
    {
      std::queue<Node<T>*> q;

      if(root != nullptr)
        q.push(root);

      Node<T>* node = nullptr;

      while(!q.empty())
      {
        node = q.front();
        q.pop();

        if(node->data == item)
        {
          std::cout<<"BFS: "<<item<<" found\n";
          return;
        }
        else
        {
          if(node->left != nullptr)
            q.push(node->left);
          if(node->right != nullptr)
            q.push(node->right);
        }
      }
      std::cout<<"BFS: "<<item<<" not found\n";
    }
    
    void dfs (T item)
    {
      if (root != nullptr)
      {
        std::stack<Node<T>*> s;
        s.push(root);
        Node<T>* node = nullptr;

        while(!s.empty())
        {
          node = s.top();
          s.pop();

          if(node->data == item)
          {
            std::cout<<"DFS: "<<item<<" found"<<std::endl;
            return;
          }
          else
          {
            if(node->right != nullptr)
              s.push(node->right);
            if(node->left != nullptr)
              s.push(node->left);
            node = node->right;
          }
        }
      }
      std::cout<<"DFS: "<<item<<" not found"<<std::endl;
    }

    void print_bfs()
    {
      if (root == nullptr)
        return;
      queue<Node<T>*> q;
      q.push(root);
      while(!q.empty())
      {
          Node<T>* curr = q.front();
          q.pop();
          cout<<curr->key<<" ";
          if (curr->left != nullptr) 
            q.push(curr->left);
          if (curr->right != nullptr)
            q.push(curr->right);
      }
      cout<<endl;
    }

    void print_dfs()
    {
      stack<Node<T>*> s;
      s.push(root);
      while (!s.empty())
      {
        Node<T>* curr = s.top();
        s.pop();
        if (curr->right != nullptr)
          s.push(curr->right);
        if (curr->left != nullptr)
          s.push(curr->left);
        cout<<curr->key<<" ";
      }
      cout<<endl;
    }

  void print_level_by_level2(Node<T>* root)
  {
    if (root == nullptr)
      return;
    
    queue<Node<T>*> q;
    q.push(root);
    
    while (!q.empty())
    {
      int size = q.size();
      for (int i = 0; i < size; i++)
      {
        Node<T>* curr = q.front();
        q.pop();
        cout<<curr->key<<" ";
        if (curr->left != nullptr)
          q.push(curr->left);
        if (curr->right != nullptr)
          q.push(curr->right);
      }
      cout<<endl;
    }
    cout<<endl;
  }

  void printAtKLevel(Node<T>* root, int k)
  {
    if(root == nullptr)
      return;
    if (k == 0)
      cout<<root->key<<" ";
    else
    {
      printAtKLevel(root->left, k-1);
      printAtKLevel(root->right, k-1);
    }
  }

  int get_size(Node<T>* root)
  {
    if (root == nullptr)
      return 0;
    else
      return 1 + get_size(root->left) + get_size(root->right);
  }

  int get_max(Node<T>* root)
  {
    if (root == nullptr)
      return INT_MIN;
    else
      return max(root->key, max(get_max(root->left), get_max(root->right)));
  }

  int get_height(Node<T>* root)
  {
    if (root == nullptr)
      return 0;
    else
      return 1 + max(get_height(root->left), get_height(root->right));
  }

  };



  int main() {

    Tree<int> t;
    t << 1 << 2 << 3 << 6 << 8 << 10 << 24 << 34 << 20;
    t.inorder(t.root);
    std::cout<<std::endl;
    t.preorder(t.root);
    std::cout<<std::endl;
    t.postorder(t.root);
    
    cout<<endl;
    t.bfs(12);
    t.dfs(34);

    cout<<endl;

    Tree<char> b;
    b<<'a'<<'b'<<'c'<<'d'<<'e'<<'f'<<'g'<<'i'<<'h';
    b.inorder(b.root);
    std::cout<<std::endl;
    b.preorder(b.root);
    std::cout<<std::endl;
    b.postorder(b.root);
    
    cout<<endl;
    b.bfs('d');
    b.dfs('y');
  }