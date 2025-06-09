import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { Investment } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Table } from '@/components/ui/table';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import { toast } from 'sonner';

export function PortfolioManager() {
  const {
    investments,
    stats,
    loading,
    error,
    fetchInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    fetchPortfolioStats
  } = usePortfolioStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [newInvestment, setNewInvestment] = useState<Partial<Investment>>({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'fund',
    risk_level: 'medium'
  });

  useEffect(() => {
    fetchInvestments();
    fetchPortfolioStats();
  }, [fetchInvestments, fetchPortfolioStats]);

  const handleAdd = async () => {
    try {
      await addInvestment(newInvestment as Omit<Investment, 'id'>);
      setIsAddDialogOpen(false);
      setNewInvestment({
        name: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'fund',
        risk_level: 'medium'
      });
      toast.success('添加投资成功');
    } catch (error) {
      toast.error('添加投资失败');
    }
  };

  const handleEdit = async () => {
    if (!selectedInvestment) return;
    try {
      await updateInvestment(selectedInvestment.id, selectedInvestment);
      setIsEditDialogOpen(false);
      setSelectedInvestment(null);
      toast.success('更新投资成功');
    } catch (error) {
      toast.error('更新投资失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个投资吗？')) return;
    try {
      await deleteInvestment(id);
      toast.success('删除投资成功');
    } catch (error) {
      toast.error('删除投资失败');
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="space-y-6">
      {/* 投资组合概览 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">总投资额</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.total_investment)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">当前价值</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.current_value)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">总收益</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.total_return)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">收益率</h3>
          <p className="text-2xl font-bold">{formatPercentage(stats.return_rate)}</p>
        </div>
      </div>

      {/* 投资列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">投资列表</h2>
            <Button onClick={() => setIsAddDialogOpen(true)}>添加投资</Button>
          </div>
        </div>
        <Table>
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>金额</th>
              <th>购买日期</th>
              <th>当前价值</th>
              <th>收益率</th>
              <th>风险等级</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment) => (
              <tr key={investment.id}>
                <td>{investment.name}</td>
                <td>{investment.type}</td>
                <td>{formatCurrency(investment.amount)}</td>
                <td>{formatDate(investment.date)}</td>
                <td>{formatCurrency(investment.current_value)}</td>
                <td>{formatPercentage((investment.current_value - investment.amount) / investment.amount)}</td>
                <td>{investment.risk_level}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedInvestment(investment);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(investment.id)}
                  >
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* 添加投资对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">添加投资</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">名称</label>
              <Input
                value={newInvestment.name}
                onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">金额</label>
              <Input
                type="number"
                value={newInvestment.amount}
                onChange={(e) => setNewInvestment({ ...newInvestment, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买日期</label>
              <Input
                type="date"
                value={newInvestment.date}
                onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAdd}>确定</Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* 编辑投资对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">编辑投资</h2>
          {selectedInvestment && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">名称</label>
                <Input
                  value={selectedInvestment.name}
                  onChange={(e) => setSelectedInvestment({ ...selectedInvestment, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">金额</label>
                <Input
                  type="number"
                  value={selectedInvestment.amount}
                  onChange={(e) => setSelectedInvestment({ ...selectedInvestment, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">当前价值</label>
                <Input
                  type="number"
                  value={selectedInvestment.current_value}
                  onChange={(e) => setSelectedInvestment({ ...selectedInvestment, current_value: Number(e.target.value) })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleEdit}>保存</Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
} 