import Link from 'next/link';
import { Navigation } from '@/types';
import { ChevronRight, Folder } from 'lucide-react';

interface NavigationCardProps {
  navigation: Navigation;
}

export default function NavigationCard({ navigation }: NavigationCardProps) {
  return (
    <Link href={`/categories?navigationId=${navigation.id}`}>
      <div className="card p-6 h-full hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Folder className="w-6 h-6 text-primary-600" />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {navigation.title}
        </h3>

        {navigation.description && (
          <p className="text-gray-600 text-sm mb-4">{navigation.description}</p>
        )}

        {navigation.categoryCount !== undefined && (
          <div className="flex items-center text-sm text-gray-500">
            <span>{navigation.categoryCount} categories</span>
          </div>
        )}
      </div>
    </Link>
  );
}
