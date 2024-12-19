#include <iostream>
using namespace std;
/*
class Matriz{
private:
    int m[3][3];
public:
    
};
 */

int main(int argc, const char * argv[]) {
    // insert code here...
    int a[3][3]={{1,1,1},{2,2,2},{3,3,3}};
    int b[3][3]={{3,3,3},{2,2,2},{1,1,1}};
    int c[3][3];
    
    for(int i=0; i<3; i++){
        for(int j=0; j<3; j++){
            cout << &a[i][j] << " ";
        }
        cout << endl;
    }
    
    for(int i=0; i<3; i++){
        for(int j=0; j<3; j++){
            c[i][j] = a[i][j] + b[i][j];
        }
    }
    
    for(int i=0; i<3; i++){
        for(int j=0; j<3; j++){
            cout << c[i][j] << " ";
        }
        cout << endl;
    }
    
    int **x;
    int **y;
    int **z;
    
    int n, m;
    
    cout << "Ingrese n: ";
    cin >> n;
    
    cout << "Ingrese m: ";
    cin >> m;
    
    x = new int *[n];
    y = new int *[n];
    z = new int *[n];
    
    for(int i=0; i<n; i++){
        x[i] = new int[m];
        y[i] = new int[m];
        z[i] = new int[m];
    }
    
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            cout << "x[" << i <<"]["<<j<<"]: ";
            cin >> x[i][j];
        }
    }
    
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            cout << "y[" << i <<"]["<<j<<"]: ";
            cin >> y[i][j];
        }
    }
    
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            z[i][j] = x[i][j] + y[i][j];
        }
    }
    
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            cout << z[i][j] << " ";
        }
        cout << endl;
    }
    
    for(int i=0; i<n; i++){
        for(int j=0; j<m; j++){
            cout << &z[i][j] << " ";
        }
        cout << endl;
    }
    
    return 0;
}
